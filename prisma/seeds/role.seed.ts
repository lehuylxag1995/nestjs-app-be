import {
  Permission,
  PermissionActions,
  PermissionSubjects,
  PrismaClient,
} from '@prisma/client';
import { createUserByRole } from './users.seed';
const prisma = new PrismaClient();

export async function createRoleAndPermission() {
  await prisma.$transaction(async (prisma) => {
    // 1./ Tạo role.
    const roleCustomer = await prisma.role.create({
      data: {
        name: 'CUSTOMER',
      },
    });

    const roleAdmin = await prisma.role.create({
      data: {
        name: 'ADMIN',
      },
    });

    const roleStaff = await prisma.role.create({
      data: {
        name: 'STAFF',
      },
    });

    console.log(`✅ Seed Role`);

    // 2./ Tạo permission ??
    // 2.1/ Tạo permission cho admin toàn quyền tất cả bảng
    const adminPermissions: Permission[] = [];

    for (const subject of Object.values(PermissionSubjects)) {
      const permission = await prisma.permission.create({
        data: {
          actions: PermissionActions.manage,
          subjects: subject,
          allowed: true,
          fields: [],
        },
      });

      adminPermissions.push(permission);
    }

    // 2.2/ Tạo permission cho staff
    const staffPermissions: Permission[] = [];

    // 2.2.1/ Staff chỉ có quyền đọc tất cả người dùng trừ password
    staffPermissions.push(
      await prisma.permission.create({
        data: {
          actions: PermissionActions.read,
          subjects: PermissionSubjects.User,
          allowed: true,
          fields: [
            'id',
            'email',
            'name',
            'phone',
            'address',
            'CCCD',
            'isActive',
            'username',
          ],
        },
      }),
    );

    // 2.2.2/ Staff có thể manage Supplier, Category, Product, ProductVariant
    const staffManageSubjects = [
      PermissionSubjects.Supplier,
      PermissionSubjects.Category,
      PermissionSubjects.Product,
      PermissionSubjects.ProductVariant,
      PermissionSubjects.Image,
      PermissionSubjects.File,
    ];

    for (const subject of staffManageSubjects) {
      staffPermissions.push(
        await prisma.permission.create({
          data: {
            actions: PermissionActions.manage,
            subjects: subject,
            allowed: true,
            fields: [],
          },
        }),
      );
    }

    // 2.2.3/ Staff có thể đọc và cập nhật Order (nhưng không tạo/xóa)
    staffPermissions.push(
      await prisma.permission.create({
        data: {
          actions: PermissionActions.read,
          subjects: PermissionSubjects.Order,
          allowed: true,
          fields: [],
        },
      }),
    );

    staffPermissions.push(
      await prisma.permission.create({
        data: {
          actions: PermissionActions.update,
          subjects: PermissionSubjects.Order,
          allowed: true,
          fields: ['status'],
        },
      }),
    );

    // 2.2.4/ Staff có thể manage Purchase Orders và Inventory
    const staffPurchaseSubjects = [
      PermissionSubjects.PurcharsOrder,
      PermissionSubjects.PurcharsOrderItem,
      PermissionSubjects.PurchaseOrderItemReceipt,
      PermissionSubjects.InventoryTransaction,
      PermissionSubjects.Inventory,
    ];

    for (const subject of staffPurchaseSubjects) {
      staffPermissions.push(
        await prisma.permission.create({
          data: {
            actions: PermissionActions.manage,
            subjects: subject,
            allowed: true,
            fields: [],
          },
        }),
      );
    }

    // 2.3/ Tạo quyền cho Customer
    const customerPermissions: Permission[] = [];

    // 2.3.1/ Customer chỉ có thể đọc và cập nhật profile của chính họ
    customerPermissions.push(
      await prisma.permission.create({
        data: {
          actions: PermissionActions.read,
          subjects: PermissionSubjects.User,
          allowed: true,
          fields: ['id', 'email', 'name', 'phone', 'address'],
          conditions: { userId: '${user.id}' }, // Chỉ được xem thông tin của chính mình
        },
      }),
    );

    customerPermissions.push(
      await prisma.permission.create({
        data: {
          actions: PermissionActions.update,
          subjects: PermissionSubjects.User,
          allowed: true,
          fields: ['name', 'phone', 'address'], // Không được đổi email
          conditions: { userId: '${user.id}' },
        },
      }),
    );

    // 2.3.2/ Customer có thể đọc Product, Category (public info)
    const customerReadSubjects = [
      PermissionSubjects.Category,
      PermissionSubjects.Product,
      PermissionSubjects.ProductVariant,
      PermissionSubjects.Image,
    ];

    for (const subject of customerReadSubjects) {
      customerPermissions.push(
        await prisma.permission.create({
          data: {
            actions: PermissionActions.read,
            subjects: subject,
            allowed: true,
            fields: [],
            conditions: { published: true }, // Chỉ xem được items đang published
          },
        }),
      );
    }

    // 2.3.3/ Customer có thể tạo Order và xem Order của mình
    customerPermissions.push(
      await prisma.permission.create({
        data: {
          actions: PermissionActions.create,
          subjects: PermissionSubjects.Order,
          allowed: true,
          fields: [],
        },
      }),
    );

    customerPermissions.push(
      await prisma.permission.create({
        data: {
          actions: PermissionActions.read,
          subjects: PermissionSubjects.Order,
          allowed: true,
          fields: [],
          conditions: { userId: '${user.id}' }, // Chỉ xem được order của mình
        },
      }),
    );

    customerPermissions.push(
      await prisma.permission.create({
        data: {
          actions: PermissionActions.read,
          subjects: PermissionSubjects.OrderItem,
          allowed: true,
          fields: [],
          conditions: { 'order.userId': '${user.id}' },
        },
      }),
    );

    console.log(`✅ Seed Permission `);

    // 3/ Gán permission cho role
    for (const permission of adminPermissions) {
      await prisma.permissionsOnRoles.create({
        data: {
          roleId: roleAdmin.id,
          permissionId: permission.id,
        },
      });
    }

    for (const permission of staffPermissions) {
      await prisma.permissionsOnRoles.create({
        data: {
          roleId: roleStaff.id,
          permissionId: permission.id,
        },
      });
    }

    for (const permission of customerPermissions) {
      await prisma.permissionsOnRoles.create({
        data: {
          roleId: roleCustomer.id,
          permissionId: permission.id,
        },
      });
    }

    console.log('✅ Seed permissions to roles');

    // 4./ Ví dụ: Staff không được xóa User
    const denyPermission = await prisma.permission.create({
      data: {
        actions: PermissionActions.delete,
        subjects: PermissionSubjects.User,
        allowed: false, // Deny permission
        fields: [],
      },
    });

    await prisma.permissionsOnRoles.create({
      data: {
        roleId: roleStaff.id,
        permissionId: denyPermission.id,
      },
    });

    // Tạo User với roleId
    createUserByRole(2, roleAdmin.id);
    createUserByRole(5, roleCustomer.id);
    createUserByRole(50, roleStaff.id);
  });
}
