    import React, { useEffect, useState } from 'react';
    import { Button, DatePicker, Divider, Form, Input, InputNumber, Modal, Select, Space, Table, Tabs, Tooltip } from 'antd';
    import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

    type FieldType = 'string' | 'number' | 'date';
    type FieldConfig = { id: string; name: string; type: FieldType };
    type RegisterBook = { year: number; id: string; currentNumber: number };
    type Decision = { id: string; registerId: string; number: string; date: string; summary: string; searchCount: number };
    type Diploma = {
        id: string;
        registerId: string;
        registerNumber: number;
        code: string;
        studentId: string;
        name: string;
        dob: string;
        decisionId?: string;
        extras: Record<string, string | number>;
    };

    const LS = {
        fields: 'vb_fields',
        registers: 'vb_registers',
        decisions: 'vb_decisions',
        diplomas: 'vb_diplomas',
    };

    function uid(prefix = '') { return prefix + Math.random().toString(36).slice(2, 9); }

    function useLocalStorage<T>(key: string, initial: T) {
        const [state, setState] = useState<T>(() => {
            try {
                const raw = localStorage.getItem(key);
                return raw ? (JSON.parse(raw) as T) : initial;
            } catch (e) { return initial; }
        });
        useEffect(() => { localStorage.setItem(key, JSON.stringify(state)); }, [key, state]);
        return [state, setState] as const;
    }

    export default function VanBangPage(): JSX.Element {
        const [activeKey, setActiveKey] = useState<'registers'|'decisions'|'fields'|'diplomas'|'search'>('registers');

        const [fields, setFields] = useLocalStorage<FieldConfig[]>(LS.fields, []);
        const [registers, setRegisters] = useLocalStorage<RegisterBook[]>(LS.registers, []);
        const [decisions, setDecisions] = useLocalStorage<Decision[]>(LS.decisions, []);
        const [diplomas, setDiplomas] = useLocalStorage<Diploma[]>(LS.diplomas, []);

        const [fieldModalVisible, setFieldModalVisible] = useState(false);
        const [editingField, setEditingField] = useState<FieldConfig | null>(null);

        // --- Registers ---
        const addRegister = (year: number) => {
            if (registers.find(r => r.year === year)) { Modal.warning({ title: 'Lỗi', content: 'Sổ cho năm này đã tồn tại' }); return; }
            const r: RegisterBook = { year, id: uid('r_'), currentNumber: 0 };
            setRegisters(prev => [...prev, r]);
        };

        // --- Fields ---
        const saveField = (f: FieldConfig) => {
            if (editingField) {
                setFields(prev => prev.map(p => p.id === f.id ? f : p));
            } else {
                setFields(prev => [...prev, f]);
            }
            setEditingField(null);
            setFieldModalVisible(false);
        };
        const removeField = (id: string) => setFields(prev => prev.filter(f => f.id !== id));

        // --- Decisions ---
        const addDecision = (d: Omit<Decision,'id'|'searchCount'>) => {
            setDecisions(prev => [...prev, { ...d, id: uid('d_'), searchCount: 0 }]);
        };

        // --- Diplomas ---
        const addDiploma = (payload: Omit<Diploma,'id'|'registerNumber'> & { registerId: string }) => {
            const reg = registers.find(r => r.id === payload.registerId);
            if (!reg) { Modal.error({ title: 'Lỗi', content: 'Chưa chọn sổ hợp lệ' }); return; }
            const next = reg.currentNumber + 1;
            const p: Diploma = { id: uid('p_'), ...payload as any, registerNumber: next };
            setDiplomas(prev => [...prev, p]);
            setRegisters(prev => prev.map(r => r.id === reg.id ? { ...r, currentNumber: next } : r));
        };

        // --- Search ---
        function doSearch(params: Partial<Pick<Diploma,'code'|'registerNumber'|'studentId'|'name'|'dob'>>) {
            const provided = Object.values(params).filter(v => v !== undefined && v !== '').length;
            if (provided < 2) { Modal.warning({ title: 'Yêu cầu', content: 'Nhập ít nhất 2 tham số tìm kiếm' }); return []; }
            const results = diplomas.filter(p => {
                if (params.code && p.code !== params.code) return false;
                if (params.registerNumber && p.registerNumber !== params.registerNumber) return false;
                if (params.studentId && p.studentId !== params.studentId) return false;
                if (params.name && !p.name.toLowerCase().includes(String(params.name).toLowerCase())) return false;
                if (params.dob && p.dob !== params.dob) return false;
                return true;
            });
            const decisionIdsToInc = Array.from(new Set(results.map(r => r.decisionId).filter(Boolean) as string[]));
            if (decisionIdsToInc.length) {
                setDecisions(prev => prev.map(d => decisionIdsToInc.includes(d.id) ? { ...d, searchCount: d.searchCount + 1 } : d));
            }
            return results;
        }

        // --- UI pieces ---
        const registersColumns = [
            { title: 'Năm', dataIndex: 'year' },
            { title: 'Số hiện tại', dataIndex: 'currentNumber' },
        ];

        const diplomasColumns = [
            { title: 'MSV', dataIndex: 'studentId' },
            { title: 'Họ tên', dataIndex: 'name' },
            { title: 'Số vào sổ', dataIndex: 'registerNumber' },
            { title: 'Số hiệu', dataIndex: 'code' },
            { title: 'Sổ', dataIndex: 'registerId', render: (v:string)=> registers.find(r=>r.id===v)?.year },
            { title: 'QĐ', dataIndex: 'decisionId', render: (v:string)=> decisions.find(d=>d.id===v)?.number },
        ];

        // Field modal form
        const FieldForm: React.FC<{ onSave: (f: FieldConfig) => void; initial?: FieldConfig }> = ({ onSave, initial }) => {
            const [form] = Form.useForm();
            useEffect(()=> { if(initial) form.setFieldsValue(initial); else form.resetFields(); }, [initial]);
            return (
                <Form form={form} layout="vertical" onFinish={(vals)=> onSave({ id: initial?.id || uid('f_'), name: vals.name, type: vals.type })}>
                    <Form.Item name="name" label="Tên trường" rules={[{ required: true }]}> <Input /> </Form.Item>
                    <Form.Item name="type" label="Kiểu dữ liệu" rules={[{ required: true }]}> <Select>
                        <Select.Option value="string">Chuỗi</Select.Option>
                        <Select.Option value="number">Số</Select.Option>
                        <Select.Option value="date">Ngày</Select.Option>
                    </Select></Form.Item>
                    <Form.Item><Button htmlType="submit" type="primary">Lưu</Button></Form.Item>
                </Form>
            );
        };

        // Diploma form component
        const DiplomaForm: React.FC = () => {
            const [form] = Form.useForm();
            useEffect(()=> form.resetFields(), [fields.length]);
            return (
                <Form form={form} layout="vertical" onFinish={(vals)=> {
                    const extras: Record<string,string|number> = {};
                    fields.forEach(f => { extras[f.id] = vals[`f_${f.id}`]; });
                    addDiploma({ registerId: vals.registerId, code: vals.code, studentId: vals.studentId, name: vals.name, dob: vals.dob, decisionId: vals.decisionId || undefined, extras });
                    form.resetFields();
                }}>
                    <Form.Item name="registerId" label="Chọn sổ" rules={[{ required: true }]}>
                        <Select placeholder="Chọn sổ">{registers.map(r=> <Select.Option key={r.id} value={r.id}>{r.year}</Select.Option>)}</Select>
                    </Form.Item>
                    <Form.Item name="decisionId" label="Quyết định (tùy chọn)"><Select allowClear>{decisions.map(d=> <Select.Option key={d.id} value={d.id}>{d.number} ({registers.find(r=>r.id===d.registerId)?.year})</Select.Option>)}</Select></Form.Item>
                    <Form.Item name="code" label="Số hiệu văn bằng" rules={[{ required: true }]}><Input/></Form.Item>
                    <Form.Item name="studentId" label="Mã sinh viên" rules={[{ required: true }]}><Input/></Form.Item>
                    <Form.Item name="name" label="Họ tên" rules={[{ required: true }]}><Input/></Form.Item>
                    <Form.Item name="dob" label="Ngày sinh" rules={[{ required: true }]}><DatePicker style={{width:'100%'}}/></Form.Item>
                    <Divider/>
                    <h4>Trường phụ lục</h4>
                    {fields.map(f=> (
                        <Form.Item key={f.id} name={`f_${f.id}`} label={`${f.name} (${f.type})`}>
                            {f.type === 'date' ? <DatePicker style={{width:'100%'}}/> : f.type === 'number' ? <InputNumber style={{width:'100%'}}/> : <Input/>}
                        </Form.Item>
                    ))}
                    <Form.Item><Button type="primary" htmlType="submit">Thêm văn bằng</Button></Form.Item>
                </Form>
            );
        };

        // Search form component
        const SearchForm: React.FC = () => {
            const [form] = Form.useForm();
            const [results, setResults] = useState<Diploma[]|null>(null);
            return (
                <div>
                    <Form form={form} layout="inline" onFinish={(vals)=> setResults(doSearch({ code: vals.code || undefined, registerNumber: vals.registerNumber ? Number(vals.registerNumber) : undefined, studentId: vals.studentId || undefined, name: vals.name || undefined, dob: vals.dob || undefined }))}>
                        <Form.Item name="code"><Input placeholder="Số hiệu"/></Form.Item>
                        <Form.Item name="registerNumber"><Input placeholder="Số vào sổ"/></Form.Item>
                        <Form.Item name="studentId"><Input placeholder="MSV"/></Form.Item>
                        <Form.Item name="name"><Input placeholder="Họ tên"/></Form.Item>
                        <Form.Item name="dob"><DatePicker/></Form.Item>
                        <Form.Item><Button type="primary" htmlType="submit">Tìm</Button></Form.Item>
                    </Form>
                    {results && (
                        <div style={{marginTop:12}}>
                            <h4>Kết quả ({results.length})</h4>
                            <Table dataSource={results} columns={diplomasColumns} rowKey="id" pagination={{pageSize:5}}/>
                        </div>
                    )}
                </div>
            );
        };

        return (
            <div style={{padding:24}}>
                <h2>Quản lý sổ văn bằng</h2>
                <Tabs activeKey={activeKey} onChange={(k)=> setActiveKey(k as any)}>
                    <Tabs.TabPane key="registers" tab="Sổ văn bằng">
                        <Space style={{marginBottom:12}}>
                            <Form layout="inline" onFinish={(vals)=> addRegister(Number(vals.year))}>
                                <Form.Item name="year" rules={[{ required: true, message: 'Nhập năm' }]}><Input placeholder="Năm (ví dụ 2026)"/></Form.Item>
                                <Form.Item><Button htmlType="submit" type="primary">Mở sổ mới</Button></Form.Item>
                            </Form>
                        </Space>
                        <Table dataSource={[...registers].sort((a,b)=>b.year-a.year)} columns={registersColumns} rowKey="id" pagination={false} />
                    </Tabs.TabPane>

                    <Tabs.TabPane key="decisions" tab="Quyết định">
                        <Form layout="inline" onFinish={(vals)=> addDecision({ registerId: vals.registerId, number: vals.number, date: vals.date.format ? vals.date.format('YYYY-MM-DD') : vals.date, summary: vals.summary })}>
                            <Form.Item name="registerId" rules={[{ required: true }]}><Select style={{width:180}} placeholder="Chọn sổ">{registers.map(r=> <Select.Option key={r.id} value={r.id}>{r.year}</Select.Option>)}</Select></Form.Item>
                            <Form.Item name="number" rules={[{ required: true }]}><Input placeholder="Số QĐ"/></Form.Item>
                            <Form.Item name="date" rules={[{ required: true }]}><DatePicker/></Form.Item>
                            <Form.Item name="summary"><Input placeholder="Trích yếu"/></Form.Item>
                            <Form.Item><Button type="primary" htmlType="submit">Thêm QĐ</Button></Form.Item>
                        </Form>
                        <Divider />
                        <Table dataSource={decisions} rowKey="id" pagination={{pageSize:5}} columns={[{title:'Số QĐ',dataIndex:'number'},{title:'Ngày',dataIndex:'date'},{title:'Sổ',dataIndex:'registerId',render:(v:string)=>registers.find(r=>r.id===v)?.year},{title:'Trích yếu',dataIndex:'summary'},{title:'Tra cứu',dataIndex:'searchCount'}]} />
                    </Tabs.TabPane>

                    <Tabs.TabPane key="fields" tab="Cấu hình phụ lục">
                        <Space style={{marginBottom:12}}>
                            <Button icon={<PlusOutlined/>} onClick={()=> { setEditingField(null); setFieldModalVisible(true); }}>Thêm trường</Button>
                        </Space>
                        <Table dataSource={fields} rowKey="id" pagination={false} columns={[{title:'Tên',dataIndex:'name'},{title:'Kiểu',dataIndex:'type'},{title:'',render:(_,rec:FieldConfig)=> (<Space><Tooltip title="Sửa"><Button icon={<EditOutlined/>} onClick={()=>{ setEditingField(rec); setFieldModalVisible(true); }} /></Tooltip><Tooltip title="Xóa"><Button danger icon={<DeleteOutlined/>} onClick={()=> removeField(rec.id)} /></Tooltip></Space>) }]} />
                        <Modal visible={fieldModalVisible} title={editingField ? 'Sửa trường' : 'Thêm trường'} footer={null} onCancel={()=> { setEditingField(null); setFieldModalVisible(false); }}>
                            <FieldForm onSave={saveField} initial={editingField || undefined} />
                        </Modal>
                    </Tabs.TabPane>

                    <Tabs.TabPane key="diplomas" tab="Thông tin văn bằng">
                        <DiplomaForm />
                        <Divider />
                        <Table dataSource={diplomas} columns={diplomasColumns} rowKey="id" pagination={{pageSize:8}} />
                    </Tabs.TabPane>

                    <Tabs.TabPane key="search" tab="Tra cứu">
                        <SearchForm />
                    </Tabs.TabPane>
                </Tabs>
            </div>
        );
    }
