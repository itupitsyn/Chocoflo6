'use client';

import { ListCheckIcon, Menu } from 'lucide-react';
import Link from 'next/link';
import { FC } from 'react';

import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export const CustomerMenu: FC = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon-sm">
          <Menu />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-40" align="start">
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/orders">
              <ListCheckIcon />
              Заказы
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
