'use client';

import { Menu } from 'lucide-react';
import Link from 'next/link';
import { FC, useState } from 'react';

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

export const AdminMenu: FC = () => {
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
              Добавить вкусни
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link href="/options">Опции</Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <AddProductForm isOpen={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
    </>
  );
};
