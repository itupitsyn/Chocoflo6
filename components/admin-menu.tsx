'use client';

import { CogIcon, ListCheckIcon, Menu, PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { FC, useState } from 'react';

import { Option } from '@/lib/generated/prisma/client';
import { NormalizePrice } from '@/lib/types';

import { AddProductForm } from './product/add-porduct-form';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface AdminMenuProps {
  opts: NormalizePrice<Option>[];
}

export const AdminMenu: FC<AdminMenuProps> = ({ opts }) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon-sm">
            <Menu />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-40" align="start">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Управление</DropdownMenuLabel>

            <DropdownMenuItem
              onClick={() => {
                setIsAddDialogOpen(true);
              }}
            >
              <PlusIcon />
              Добавить вкусни
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link href="/options">
                <CogIcon />
                Опции
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link href="/orders">
                <ListCheckIcon />
                Заказы
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <AddProductForm isOpen={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} opts={opts} />
    </>
  );
};
