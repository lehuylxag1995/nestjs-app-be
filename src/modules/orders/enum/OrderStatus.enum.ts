export enum OrderStatus {
  PENDING = 'PENDING', // Chờ xác nhận
  DELIVERED = 'DELIVERED', // Vận chuyển
  SHIPPED = 'SHIPPED', // Đã giao
  CANCELLED = 'CANCELLED', // Hủy đơn
  PAID = 'PAID', // Trả
}
