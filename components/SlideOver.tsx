import React from 'react';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import ClientOnly from './ClientOnly';

export default function SlideOver({
  isOpen,
  onClose,
  children,
  direction,
}: {
  isOpen: boolean;
  onClose: (status: boolean) => void;
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'top' | 'bottom';
}) {
  return (
    <ClientOnly>
      <Drawer
        open={isOpen}
        onClose={() => onClose(!isOpen)}
        direction={direction || 'right'}
        className="drawer"
        size={'400px'}
        style={{ maxWidth: '90vw', maxHeight: '100vh', overflowY: 'auto' }}
        lockBackgroundScroll={true}
      >
        {children}
      </Drawer>
    </ClientOnly>
  );
}
