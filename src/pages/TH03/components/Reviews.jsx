import { Card, Empty, List, Rate } from "antd";
import { useState } from "react";

export default function Reviews() {

  const [reviews] = useState([
  
  ]);

  return (
    <div>
      <Card title="Khách hàng nhận xét">

        {reviews.length === 0 ? (
          <Empty description="Chưa có đánh giá nào từ khách hàng" />
        ) : (
          <List
            dataSource={reviews}
            rowKey={(item, index) => index}
            renderItem={(item) => (
              <List.Item>
                <div>
                  <b>{item.customer}</b> - {item.employee} <br />
                  <Rate disabled defaultValue={item.rating} />
                  <p>{item.comment}</p>
                </div>
              </List.Item>
            )}
          />
        )}

      </Card>
    </div>
  );
}
