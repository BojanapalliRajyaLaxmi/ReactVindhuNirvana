import React, { useState } from "react";
import { Modal, Select, TimePicker, Button } from "antd";
import dayjs from "dayjs";

const PreorderModal = ({ isOpen, onClose, restaurant }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [pickupTime, setPickupTime] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");

  const handleConfirm = () => {
    if (!pickupTime || !paymentMethod) {
      alert("Please select all fields!");
      return;
    }
    console.log("Preorder Details:", {
      restaurant,
      selectedItems,
      pickupTime: pickupTime.format("HH:mm"),
      paymentMethod,
    });
    onClose(); // Close modal after confirming
  };

  return (
    <Modal title={`Preorder from ${restaurant}`} open={isOpen} onCancel={onClose} footer={null}>
      <div>
        <label>Select Items:</label>
        <Select
          mode="multiple"
          placeholder="Choose items"
          style={{ width: "100%", marginBottom: "10px" }}
          onChange={(values) => setSelectedItems(values)}
        >
          <Select.Option value="Burger">Burger</Select.Option>
          <Select.Option value="Pizza">Pizza</Select.Option>
          <Select.Option value="Pasta">Pasta</Select.Option>
        </Select>

        <label>Pick-up Time:</label>
        <TimePicker
          format="HH:mm"
          style={{ width: "100%", marginBottom: "10px" }}
          onChange={(time) => setPickupTime(time)}
        />

        <label>Payment Method:</label>
        <Select
          placeholder="Select payment method"
          style={{ width: "100%", marginBottom: "10px" }}
          onChange={(value) => setPaymentMethod(value)}
        >
          <Select.Option value="Cash">Cash</Select.Option>
          <Select.Option value="Card">Card</Select.Option>
          <Select.Option value="UPI">UPI</Select.Option>
        </Select>

        <Button type="primary" onClick={handleConfirm} style={{ width: "100%" }}>
          Confirm Preorder
        </Button>
      </div>
    </Modal>
  );
};

export default PreorderModal;
