import { AbilityBuilder, PureAbility } from '@casl/ability';
import { createPrismaAbility, PrismaQuery, Subjects } from '@casl/prisma';

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
  Prisma,
  Product,
  ProductVariant,
  PurcharsOrder,
  PurcharsOrderItem,
  PurchaseOrderItemReceipt,
  Supplier,
  User,
} from '@prisma/client';
import { JsonValue } from '@prisma/client/runtime/library';

//Định nghĩa các hành động
// type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete';
export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

// Định nghĩa các thể loại
export type AppSubjects =
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
      PurchaseOrderItemReceipt: PurchaseOrderItemReceipt;
      Order: Order;
      OrderItem: OrderItem;
      InventoryTransaction: InventoryTransaction;
      PricingRule: PricingRule;
      Inventory: Inventory;
    }>;

// Định nghĩa type chính xác theo return type của findUserByIdWithRole
export type UserPermissionOnRole = Prisma.UserGetPayload<{
  include: {
    Role: {
      include: {
        Permissions: {
          include: {
            Permission: true;
          };
        };
      };
    };
  };
}>;

export type AppAbility = PureAbility<[Action, AppSubjects], PrismaQuery>;

function parseConditions(condition: JsonValue, user: User) {
  if (!condition) return undefined;
  const str = JSON.stringify(condition);

  const replaced = str.replace(/\${user\.id}/g, user.id);

  return JSON.parse(replaced);
}

@Injectable()
export class CaslAbilityFactory {
  //Định nghĩa ability cho user
  createForUser(user: UserPermissionOnRole) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createPrismaAbility,
    );

    // 1. Dùng vòng lặp để xây dựng các quy tắc
    user.Role.Permissions.forEach((p) => {
      const perm = p.Permission;
      const action = perm.actions as Action;
      const subject = perm.subjects;
      const fields = perm.fields ?? [];
      const condition = parseConditions(perm.conditions, user);

      // console.log(
      //   `${action}-${subject}-${fields}-${JSON.stringify(condition)}`,
      // );

      if (perm.allowed) {
        if (fields.length && condition) can(action, subject, fields, condition);
        else if (condition) can(action, subject, condition);
        else if (fields.length) can(action, subject, fields);
        else can(action, subject);
      }
    });

    return build();
  }
}
