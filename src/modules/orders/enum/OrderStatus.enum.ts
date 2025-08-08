export enum OrderStatus {
  PENDING = 'PENDING', // Chờ xác nhận
  CONFIRMED = 'CONFIRMED', // Xác nhận đơn
  DELIVERED = 'DELIVERED', // Vận chuyển
  SHIPPED = 'SHIPPED', // Đã giao
  CANCELLED = 'CANCELLED', // Hủy đơn
  RETURNED = 'RETURNED', // Nhận hàng trả
}
