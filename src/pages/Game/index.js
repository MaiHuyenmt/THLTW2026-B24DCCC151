import React, { useState } from 'react';
import { Card, Input, Button, Typography, Alert, List, Space } from 'antd';

const { Title, Text } = Typography;

export default function Game() {
  const [randomNumber, setRandomNumber] = useState(
    Math.floor(Math.random() * 100) + 1
  );
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState(10);
  const [history, setHistory] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  const handleGuess = () => {
    if (!guess) return;

    const number = parseInt(guess);
    let result = '';

    if (number === randomNumber) {
      result = '🎉 Chúc mừng! Bạn đã đoán đúng!';
      setGameOver(true);
    } else if (number > randomNumber) {
      result = '📉 Bạn đoán quá cao!';
    } else {
      result = '📈 Bạn đoán quá thấp!';
    }

    setHistory([...history, number]);
    setMessage(result);

    if (number !== randomNumber) {
      const newAttempts = attemptsLeft - 1;
      setAttemptsLeft(newAttempts);
      if (newAttempts === 0) {
        setMessage(`❌ Bạn đã hết lượt! Số đúng là ${randomNumber}`);
        setGameOver(true);
      }
    }

    setGuess('');
  };

  const resetGame = () => {
    setRandomNumber(Math.floor(Math.random() * 100) + 1);
    setGuess('');
    setMessage('');
    setAttemptsLeft(10);
    setHistory([]);
    setGameOver(false);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
      <Card
        style={{ width: 500, borderRadius: 12 }}
        bordered
      >
        <Title level={4} style={{ textAlign: 'center' }}>
          🔔 Bài 1: Trò chơi Đoán số
        </Title>

        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <Text>Số lượt còn lại</Text>
          <Title level={2} style={{ color: 'green', margin: 0 }}>
            {attemptsLeft} / 10
          </Title>
        </div>

        <Alert
          message="Hệ thống đã chọn một số từ 1 đến 100."
          description="Hãy nhập con số bạn dự đoán!"
          type="info"
          showIcon
          style={{ marginBottom: 20 }}
        />

        <Input
          size="large"
          placeholder="Nhập số từ 1 - 100"
          value={guess}
          disabled={gameOver}
          onChange={(e) => setGuess(e.target.value)}
          style={{ marginBottom: 15 }}
        />

        <Button
          type="primary"
          block
          size="large"
          onClick={handleGuess}
          disabled={gameOver}
        >
          Đoán ngay
        </Button>

        {message && (
          <Alert
            message={message}
            type="success"
            showIcon
            style={{ marginTop: 20 }}
          />
        )}

        <div style={{ marginTop: 30 }}>
          <Title level={5}>🔄 Lịch sử dự đoán</Title>

          {history.length === 0 ? (
            <Text type="secondary">Chưa có lượt dự đoán nào</Text>
          ) : (
            <List
              bordered
              dataSource={history}
              renderItem={(item, index) => (
                <List.Item>
                  Lượt {index + 1}: {item}
                </List.Item>
              )}
            />
          )}
        </div>

        {gameOver && (
          <Space style={{ marginTop: 20 }}>
            <Button onClick={resetGame}>Chơi lại</Button>
          </Space>
        )}
      </Card>
    </div>
  );
}
