import { AbilityBuilder, PureAbility } from '@casl/ability';
import { createPrismaAbility, PrismaQuery, Subjects } from '@casl/prisma';
import { UserRole } from '@modules/users/types/user.type';

import { Injectable } from '@nestjs/common';
import {
  Category,
  File,
  Image,
  Inventory,
  InventoryTransaction,
  Order,
  OrderItem,
  PricingRule,
  Product,
  ProductVariant,
  PurcharsOrder,
  PurcharsOrderItem,
  PurchaseOrderItemReceipt,
  Supplier,
  User,
} from '@prisma/client';

//Định nghĩa các hành động
type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete';

// Định nghĩa các thể loại
type AppSubjects =
  | 'all'
  | Subjects<{
      User: User;
      Image: Image;
      File: File;

      Supplier: Supplier;

      Category: Category;
      Product: Product;
      ProductVariant: ProductVariant;

      PurcharsOrder: PurcharsOrder;
      PurcharsOrderItem: PurcharsOrderItem;
      PurcharsOrderReceipt: PurchaseOrderItemReceipt;

      Order: Order;
      OrderItem: OrderItem;

      InventoryTransaction: InventoryTransaction;
      PricingRule: PricingRule;
      Inventory: Inventory;
    }>;

// Định nghĩa generic User để factory xử lý
type CaslUser = Pick<User, 'id' | 'roleId'>;

type AppAbility = PureAbility<[Actions, AppSubjects], PrismaQuery>;

@Injectable()
export class CaslAbilityFactory {
  //Định nghĩa cho user (id,role)
  createForUser(user: CaslUser) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createPrismaAbility,
    );

    if (user.roleId === UserRole.ADMIN) {
      //Admin toàn quyền đọc ghi tất cả
      can('manage', 'all');
    } else if (user.roleId === UserRole.STAFF) {
      //Nhân viên thì tạo sản phẩm, sửa sản phẩm, xử lý đơn hàng

      //Xem tất cả tài khoản
      can('read', 'User');
      can('update', 'User', { id: user.id });
      cannot('update', 'User', ['isActive', 'role', 'CCCD']);
      cannot('create', 'User');
      cannot('delete', 'User');
    } else if (user.roleId === UserRole.CUSTOMER) {
      // Khách hàng thì chỉ đọc tất cả
      can('read', 'all');
    }

    return build();
  }
}
