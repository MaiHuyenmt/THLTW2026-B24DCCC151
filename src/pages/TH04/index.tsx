import React, { useEffect, useMemo, useState } from 'react';

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

function uid(prefix = '') {
  return prefix + Math.random().toString(36).slice(2, 9);
}

function useLocalStorage<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch (e) {
      return initial;
    }
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);
  return [state, setState] as const;
}

export default function VanBangPage(): JSX.Element {
  const [section, setSection] = useState<'registers'|'decisions'|'fields'|'diplomas'|'search'>('registers');

  const [fields, setFields] = useLocalStorage<FieldConfig[]>(LS.fields, []);
  const [registers, setRegisters] = useLocalStorage<RegisterBook[]>(LS.registers, []);
  const [decisions, setDecisions] = useLocalStorage<Decision[]>(LS.decisions, []);
  const [diplomas, setDiplomas] = useLocalStorage<Diploma[]>(LS.diplomas, []);

  // Helpers
  const findRegisterByYear = (year: number) => registers.find(r => r.year === year);

  // Registers UI
  function addRegister(year: number) {
    if (findRegisterByYear(year)) return alert('Sổ cho năm này đã tồn tại');
    const r: RegisterBook = { year, id: uid('r_'), currentNumber: 0 };
    setRegisters([...registers, r]);
  }

  function openNewRegister(year: number) {
    // resets numbering for a newly opened register only by creating new register
    addRegister(year);
  }

  // Fields UI
  function addField(name: string, type: FieldType) {
    const f: FieldConfig = { id: uid('f_'), name, type };
    setFields([...fields, f]);
  }
  function removeField(id: string) { setFields(fields.filter(f => f.id !== id)); }

  // Decisions UI
  function addDecision(registerId: string, number: string, date: string, summary: string) {
    const d: Decision = { id: uid('d_'), registerId, number, date, summary, searchCount: 0 };
    setDecisions([...decisions, d]);
  }

  // Diplomas UI
  function addDiploma(registerId: string, code: string, studentId: string, name: string, dob: string, decisionId?: string, extras: Record<string,string|number> = {}) {
    const reg = registers.find(r => r.id === registerId);
    if (!reg) return alert('Sổ không tồn tại');
    const next = reg.currentNumber + 1;
    const d: Diploma = { id: uid('p_'), registerId, registerNumber: next, code, studentId, name, dob, decisionId, extras };
    setDiplomas([...diplomas, d]);
    setRegisters(registers.map(r => r.id === registerId ? { ...r, currentNumber: next } : r));
  }

  // Search logic: require at least 2 params
  function doSearch(params: Partial<Pick<Diploma,'code'|'registerNumber'|'studentId'|'name'|'dob'>>) {
    const provided = Object.values(params).filter(v => v !== undefined && v !== '').length;
    if (provided < 2) { alert('Yêu cầu nhập ít nhất 2 tham số tìm kiếm'); return []; }
    const results = diplomas.filter(p => {
      if (params.code && p.code !== params.code) return false;
      if (params.registerNumber && p.registerNumber !== params.registerNumber) return false;
      if (params.studentId && p.studentId !== params.studentId) return false;
      if (params.name && !p.name.toLowerCase().includes(String(params.name).toLowerCase())) return false;
      if (params.dob && p.dob !== params.dob) return false;
      return true;
    });
    // increment searchCount for decisions of matched diplomas
    const decisionIdsToInc = Array.from(new Set(results.map(r => r.decisionId).filter(Boolean) as string[]));
    if (decisionIdsToInc.length) {
      setDecisions(decisions.map(d => decisionIdsToInc.includes(d.id) ? { ...d, searchCount: d.searchCount + 1 } : d));
    }
    return results;
  }

  // Small components per section
  const RegistersSection = () => {
    const [yearInput, setYearInput] = useState<string>('');
    return (<div>
      <h3>Quản lý sổ văn bằng</h3>
      <div style={{display:'flex',gap:8,alignItems:'center'}}>
        <input placeholder="Năm (ví dụ 2026)" value={yearInput} onChange={e=>setYearInput(e.target.value)} />
        <button onClick={()=>{ const y = Number(yearInput); if(!y) return alert('Năm không hợp lệ'); openNewRegister(y); setYearInput('');}}>Mở sổ mới</button>
      </div>
      <ul>
        {registers.sort((a,b)=>b.year-a.year).map(r=> (
          <li key={r.id}>{r.year} — Số hiện tại: {r.currentNumber}</li>
        ))}
      </ul>
    </div>);
  };

  const FieldsSection = () => {
    const [name, setName] = useState('');
    const [type, setType] = useState<FieldType>('string');
    return (<div>
      <h3>Cấu hình biểu mẫu phụ lục</h3>
      <div style={{display:'flex',gap:8}}>
        <input placeholder="Tên trường" value={name} onChange={e=>setName(e.target.value)} />
        <select value={type} onChange={e=>setType(e.target.value as FieldType)}>
          <option value="string">Chuỗi</option>
          <option value="number">Số</option>
          <option value="date">Ngày</option>
        </select>
        <button onClick={()=>{ if(!name) return alert('Nhập tên'); addField(name,type); setName(''); }}>Thêm</button>
      </div>
      <ul>
        {fields.map(f=> (
          <li key={f.id}>{f.name} — {f.type} <button onClick={()=>removeField(f.id)}>Xóa</button></li>
        ))}
      </ul>
    </div>);
  };

  const DecisionsSection = () => {
    const [regId, setRegId] = useState('');
    const [num, setNum] = useState('');
    const [date, setDate] = useState('');
    const [summary, setSummary] = useState('');
    return (<div>
      <h3>Quyết định tốt nghiệp</h3>
      <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
        <select value={regId} onChange={e=>setRegId(e.target.value)}>
          <option value="">-- Chọn sổ --</option>
          {registers.map(r=> <option key={r.id} value={r.id}>{r.year}</option>)}
        </select>
        <input placeholder="Số QĐ" value={num} onChange={e=>setNum(e.target.value)} />
        <input type="date" value={date} onChange={e=>setDate(e.target.value)} />
        <input placeholder="Trích yếu" value={summary} onChange={e=>setSummary(e.target.value)} />
        <button onClick={()=>{ if(!regId||!num||!date) return alert('Thiếu thông tin'); addDecision(regId,num,date,summary); setNum(''); setDate(''); setSummary(''); }}>Thêm QĐ</button>
      </div>
      <ul>
        {decisions.map(d=> <li key={d.id}>QĐ {d.number} — {d.date} — Sổ: {registers.find(r=>r.id===d.registerId)?.year} — Tra cứu: {d.searchCount}</li>)}
      </ul>
    </div>);
  };

  const DiplomasSection = () => {
    const [regId, setRegId] = useState('');
    const [code, setCode] = useState('');
    const [studentId, setStudentId] = useState(''); 
    const [name, setName] = useState('');
    const [dob, setDob] = useState('');
    const [decisionId, setDecisionId] = useState('');
    const extrasDefaults = useMemo(()=> {
      const obj: Record<string,string> = {};
      fields.forEach(f=> obj[f.id]='');
      return obj;
    },[fields]);
    const [extras, setExtras] = useState<Record<string,string|number>>(extrasDefaults);
    useEffect(()=> setExtras(extrasDefaults), [fields.length]);
    return (<div>
      <h3>Thông tin văn bằng</h3>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,maxWidth:900}}>
        <select value={regId} onChange={e=>setRegId(e.target.value)}>
          <option value="">-- Chọn sổ --</option>
          {registers.map(r=> <option key={r.id} value={r.id}>{r.year}</option>)}
        </select>
        <select value={decisionId} onChange={e=>setDecisionId(e.target.value)}>
          <option value="">-- Chọn quyết định (tùy chọn)--</option>
          {decisions.map(d=> <option key={d.id} value={d.id}>{d.number} ({registers.find(r=>r.id===d.registerId)?.year})</option>)}
        </select>
        <input placeholder="Số hiệu văn bằng" value={code} onChange={e=>setCode(e.target.value)} />
        <input placeholder="Mã sinh viên" value={studentId} onChange={e=>setStudentId(e.target.value)} />
        <input placeholder="Họ tên" value={name} onChange={e=>setName(e.target.value)} />
        <input type="date" placeholder="Ngày sinh" value={dob} onChange={e=>setDob(e.target.value)} />
      </div>
      <div style={{marginTop:8}}>
        <h4>Trường phụ lục</h4>
        {fields.map(f=> (
          <div key={f.id} style={{display:'flex',gap:8,alignItems:'center',marginBottom:6}}>
            <label style={{minWidth:120}}>{f.name} ({f.type})</label>
            {f.type === 'date' ? (
              <input type="date" value={String(extras[f.id]||'')} onChange={e=>setExtras({...extras,[f.id]:e.target.value})} />
            ) : (
              <input value={String(extras[f.id]||'')} onChange={e=>setExtras({...extras,[f.id]: f.type==='number' ? Number(e.target.value) : e.target.value})} />
            )}
          </div>
        ))}
        <button onClick={()=>{ if(!regId||!code||!studentId||!name||!dob) return alert('Thiếu thông tin bắt buộc'); addDiploma(regId,code,studentId,name,dob,decisionId,extras); setCode(''); setStudentId(''); setName(''); setDob(''); setExtras({}); }}>Thêm văn bằng</button>
      </div>

      <h4 style={{marginTop:12}}>Danh sách văn bằng</h4>
      <table style={{width:'100%',borderCollapse:'collapse'}}>
        <thead>
          <tr style={{textAlign:'left'}}>
            <th>MSV</th><th>Họ tên</th><th>Số vào sổ</th><th>Số hiệu</th><th>Sổ</th><th>QĐ</th>
          </tr>
        </thead>
        <tbody>
          {diplomas.map(p=> (
            <tr key={p.id}>
              <td>{p.studentId}</td>
              <td>{p.name}</td>
              <td>{p.registerNumber}</td>
              <td>{p.code}</td>
              <td>{registers.find(r=>r.id===p.registerId)?.year}</td>
              <td>{decisions.find(d=>d.id===p.decisionId)?.number||''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>);
  };

  const SearchSection = () => {
    const [code, setCode] = useState('');
    const [regNum, setRegNum] = useState<string>('');
    const [studentId, setStudentId] = useState('');
    const [name, setName] = useState('');
    const [dob, setDob] = useState('');
    const [results, setResults] = useState<Diploma[]|null>(null);
    return (<div>
      <h3>Tra cứu văn bằng</h3>
      <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
        <input placeholder="Số hiệu văn bằng" value={code} onChange={e=>setCode(e.target.value)} />
        <input placeholder="Số vào sổ" value={regNum} onChange={e=>setRegNum(e.target.value)} />
        <input placeholder="MSV" value={studentId} onChange={e=>setStudentId(e.target.value)} />
        <input placeholder="Họ tên" value={name} onChange={e=>setName(e.target.value)} />
        <input type="date" placeholder="Ngày sinh" value={dob} onChange={e=>setDob(e.target.value)} />
        <button onClick={()=> setResults(doSearch({ code: code||undefined, registerNumber: regNum? Number(regNum): undefined, studentId: studentId||undefined, name: name||undefined, dob: dob||undefined }))}>Tìm</button>
      </div>
      {results && (
        <div style={{marginTop:12}}>
          <h4>Kết quả ({results.length})</h4>
          <ul>
            {results.map(r=> (
              <li key={r.id}>{r.name} — MSV: {r.studentId} — Sổ: {registers.find(x=>x.id===r.registerId)?.year} — Số vào sổ: {r.registerNumber} — QĐ: {decisions.find(d=>d.id===r.decisionId)?.number||'--'}</li>
            ))}
          </ul>
        </div>
      )}
    </div>);
  };

  return (
    <div style={{padding:16}}>
      <h2>Quản lý sổ văn bằng — Front-end demo (localStorage)</h2>
      <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:12}}>
        {(['registers','decisions','fields','diplomas','search'] as const).map(s=> (
          <button key={s} onClick={()=>setSection(s)} style={{fontWeight: section===s?700:400}}>{s}</button>
        ))}
      </div>

      <div style={{background:'#fff',padding:12,border:'1px solid #ddd'}}>
        {section === 'registers' && <RegistersSection />}
        {section === 'fields' && <FieldsSection />}
        {section === 'decisions' && <DecisionsSection />}
        {section === 'diplomas' && <DiplomasSection />}
        {section === 'search' && <SearchSection />}
      </div>
    </div>
  );
}
