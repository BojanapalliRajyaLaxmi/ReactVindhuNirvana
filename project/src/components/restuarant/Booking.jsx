import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Booking.module.css"; // Custom styles

const Booking = () => {
  const navigate = useNavigate();
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);

  useEffect(() => {
    // Generate random tables (1-10) with random prices
    const generateTables = () => {
      let generatedTables = [];
      for (let i = 1; i <= 10; i++) {
        generatedTables.push({
          id: i,
          price: Math.floor(Math.random() * 41) + 10, // Random price $10-$50
        });
      }
      setTables(generatedTables);
    };
    generateTables();
  }, []);

  const handleBooking = () => {
    if (!selectedTable) {
      alert("Please select a table to book!");
      return;
    }
    alert(`✅ Table ${selectedTable.id} booked for $${selectedTable.price}!`);
    navigate("/booking"); // Navigate after confirmation
  };

  return (
    <div className={styles["booking-container"]}>
      <h2 className={styles["booking-title"]}>📌 Select a Table</h2>
      <div className={styles["tables-grid"]}>
        {tables.map((table) => (
          <label key={table.id} className={styles["table-box"]}>
            <input
              type="checkbox"
              checked={selectedTable?.id === table.id}
              onChange={() => setSelectedTable(table)}
            />
            <span>Table {table.id}</span>
            <span>💲{table.price}</span>
          </label>
        ))}
      </div>

      <button className={styles["booking-button"]} onClick={handleBooking}>
        Confirm Booking ✅
      </button>
    </div>
  );
};

export default Booking;
