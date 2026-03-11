import React, { useState } from "react";
import { Card, Row, Col, Typography, Table, Tag } from "antd";

const { Title, Text } = Typography;

const choices = [
  { name: "Búa", icon: "✊", color: "#ff4d4f" },
  { name: "Bao", icon: "✋", color: "#1890ff" },
  { name: "Kéo", icon: "✌", color: "#faad14" },
];

export default function Bai1() {
  const [player, setPlayer] = useState(null);
  const [computer, setComputer] = useState(null);
  const [history, setHistory] = useState([]);

  const [win, setWin] = useState(0);
  const [lose, setLose] = useState(0);
  const [draw, setDraw] = useState(0);

  const randomChoice = () => {
    return choices[Math.floor(Math.random() * choices.length)].name;
  };

  const checkResult = (p, c) => {
    if (p === c) return "Hòa";

    if (
      (p === "Búa" && c === "Kéo") ||
      (p === "Bao" && c === "Búa") ||
      (p === "Kéo" && c === "Bao")
    )
      return "Thắng";

    return "Thua";
  };

  const playGame = (choice) => {
    const comp = randomChoice();
    const result = checkResult(choice, comp);

    setPlayer(choice);
    setComputer(comp);

    if (result === "Thắng") setWin(win + 1);
    if (result === "Thua") setLose(lose + 1);
    if (result === "Hòa") setDraw(draw + 1);

    const newGame = {
      key: history.length + 1,
      player: choice,
      computer: comp,
      result,
    };

    setHistory([newGame, ...history]);
  };

  const columns = [
    {
      title: "Bạn",
      dataIndex: "player",
    },
    {
      title: "Máy",
      dataIndex: "computer",
    },
    {
      title: "Kết quả",
      dataIndex: "result",
      render: (text) => {
        if (text === "Thắng") return <Tag color="green">Thắng</Tag>;
        if (text === "Thua") return <Tag color="red">Thua</Tag>;
        return <Tag color="gold">Hòa</Tag>;
      },
    },
  ];

  return (
    <div
      style={{
        background: "linear-gradient(135deg,#0f1b2d,#091329)",
        padding: 30,
        borderRadius: 20,
      }}
    >
      <Title style={{ textAlign: "center", color: "white" }}>
        🏆 Đấu Trường Oẳn Tù Tì
      </Title>

      {/* Player vs Computer */}
      <Row justify="space-around" align="middle" style={{ marginTop: 30 }}>
        <Col style={{ textAlign: "center" }}>
          <div
            style={{
              width: 110,
              height: 110,
              borderRadius: "50%",
              background: "#2f6df6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 35,
              boxShadow: "0 0 20px rgba(47,109,246,0.6)",
            }}
          >
            {player ? player : "👤"}
          </div>
          <Text style={{ color: "white" }}>Bạn</Text>
        </Col>

        <Col>
          <Title style={{ color: "#666" }}>V.S</Title>
        </Col>

        <Col style={{ textAlign: "center" }}>
          <div
            style={{
              width: 110,
              height: 110,
              borderRadius: "50%",
              background: "#3b4a63",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 35,
            }}
          >
            {computer ? computer : "🤖"}
          </div>
          <Text style={{ color: "white" }}>Máy</Text>
        </Col>
      </Row>

      {/* Buttons */}
      <Row justify="center" gutter={30} style={{ marginTop: 50 }}>
        {choices.map((item) => (
          <Col key={item.name}>
            <div
              onClick={() => playGame(item.name)}
              style={{
                width: 90,
                height: 90,
                background: item.color,
                borderRadius: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 35,
                cursor: "pointer",
                transition: "0.2s",
                boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              {item.icon}
            </div>
          </Col>
        ))}
      </Row>

      {/* Score */}
      <Row
        justify="space-around"
        style={{
          marginTop: 50,
          borderTop: "1px solid #333",
          paddingTop: 25,
        }}
      >
        <Col style={{ textAlign: "center" }}>
          <Text style={{ color: "#aaa" }}>Bạn Thắng</Text>
          <Title style={{ color: "#52c41a" }}>{win}</Title>
        </Col>

        <Col style={{ textAlign: "center" }}>
          <Text style={{ color: "#aaa" }}>Hòa</Text>
          <Title style={{ color: "#faad14" }}>{draw}</Title>
        </Col>

        <Col style={{ textAlign: "center" }}>
          <Text style={{ color: "#aaa" }}>Máy Thắng</Text>
          <Title style={{ color: "#ff4d4f" }}>{lose}</Title>
        </Col>
      </Row>

      {/* History */}
      <Card
        title="🕘 Lịch sử ván đấu mới nhất"
        style={{ marginTop: 30 }}
      >
        <Table
          columns={columns}
          dataSource={history}
          pagination={false}
          locale={{ emptyText: "Hãy bắt đầu ván đầu tiên!" }}
        />
      </Card>
    </div>
  );
}
