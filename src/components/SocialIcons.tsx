import React from 'react';
import { Instagram, Facebook, Youtube, MessageCircle } from 'lucide-react';

export const TikTokIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.3 6.3 0 0 0 1.87-4.49v-7a8.16 8.16 0 0 0 4.77 1.52v-3.49h-.87z" />
  </svg>
);

export const XIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.23 8.23 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.59c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29z" />
  </svg>
);

export interface SocialLinkItem {
  id: string;
  name: string;
  handle: string;
  href: string;
  icon: React.FC<{ className?: string }>;
}

export const SOCIAL_LINKS: SocialLinkItem[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    handle: '@zevora.pk',
    href: 'https://instagram.com/zevora.pk',
    icon: Instagram,
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    handle: '+92 300 8456123',
    href: 'https://wa.me/923008456123',
    icon: WhatsAppIcon,
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    handle: '@zevora.luxury',
    href: 'https://tiktok.com/@zevora.luxury',
    icon: TikTokIcon,
  },
  {
    id: 'facebook',
    name: 'Facebook',
    handle: 'ZEVORA Luxury',
    href: 'https://facebook.com/zevoraofficial',
    icon: Facebook,
  },
  {
    id: 'x',
    name: 'X (Twitter)',
    handle: '@zevora',
    href: 'https://x.com/zevoraofficial',
    icon: XIcon,
  },
  {
    id: 'youtube',
    name: 'YouTube',
    handle: 'ZEVORA Atelier',
    href: 'https://youtube.com/@zevoraofficial',
    icon: Youtube,
  },
];
