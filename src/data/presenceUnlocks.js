import { Mic, PanelsTopLeft, Shirt } from 'lucide-react';

export const presenceUnlocks = [
  {
    id: 'new-companion-voice',
    name: 'New Companion Voice',
    description: 'Give your companion a new voice and a different way to be there with you.',
    cost: 750,
    duration: 'Permanent',
    type: 'permanent',
    icon: Mic,
    available: true,
  },
  {
    id: 'avatar-outfit',
    name: 'Avatar Outfit',
    description: 'Give your companion something new to wear.',
    cost: 1000,
    duration: 'Permanent',
    type: 'permanent',
    icon: Shirt,
    available: false,
  },
  {
    id: 'companion-environment',
    name: 'Companion Environment',
    description: 'Change the space where your conversations happen.',
    cost: 1500,
    duration: 'Permanent',
    type: 'permanent',
    icon: PanelsTopLeft,
    available: false,
  },
];
