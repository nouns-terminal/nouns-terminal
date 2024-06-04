import React from 'react';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';

export default function SlideOver({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: (status: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <>
      <Drawer open={isOpen} onClose={() => onClose(!isOpen)} direction="right" className="drawer">
        {children}
      </Drawer>
    </>
  );
}
