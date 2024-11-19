import React from 'react';
import { db } from '@/lib/db';

const TestPage = async () => {
  const rooms = await db.room.findMany();

  return (
    <div>
      {rooms.map((room) => (
        <div key={room.id}>{room.description}</div>
      ))}
    </div>
  );
};

export default TestPage;
