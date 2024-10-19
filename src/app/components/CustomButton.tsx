'use client';

import React, { MouseEventHandler } from 'react';
import { Button } from '@headlessui/react';
import { Launch } from '@carbon/icons-react';

interface ButtonProps {
  externalLink?: boolean,
  icon: React.ReactNode | null, 
  text: string | null,
  onclick: MouseEventHandler<HTMLButtonElement> | undefined,
  disabled?: boolean
}

const CustomButton = (props: ButtonProps) => {
  const { externalLink, icon, text, onclick, disabled } = props;
  return (
    <Button className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
      onClick={onclick} disabled={disabled}
    >
      {icon}
      {text}
      {externalLink && <Launch />}
    </Button>
  );
};

export default CustomButton;