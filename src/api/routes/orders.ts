import { Router } from "express";
const router = Router();

// Handle incoming GET requests to /orders
router.get("/", (_, res, _2) => {
  res.status(200).json({
    message: "Orders were fetched",
  });
});

router.post("/", (_, res, _2) => {
  res.status(201).json({
    message: "Order was created",
  });
});

router.get("/:orderId", (req, res, _) => {
  res.status(200).json({
    message: "Order details",
    orderId: req.params.orderId,
  });
});

router.delete("/:orderId", (req, res, _) => {
  res.status(200).json({
    message: "Order deleted",
    orderId: req.params.orderId,
  });
});

export default router;
