import { Phobia } from '../types/phobia';

export const PHOBIAS: Phobia[] = [
  // Animal phobias
  {
    id: 'arachnophobia',
    name: 'Arachnophobia',
    description: 'Fear of spiders',
    category: 'animal',
  },
  {
    id: 'ophidiophobia',
    name: 'Ophidiophobia',
    description: 'Fear of snakes',
    category: 'animal',
  },
  {
    id: 'cynophobia',
    name: 'Cynophobia',
    description: 'Fear of dogs',
    category: 'animal',
  },
  {
    id: 'entomophobia',
    name: 'Entomophobia',
    description: 'Fear of insects',
    category: 'animal',
  },
  {
    id: 'ornithophobia',
    name: 'Ornithophobia',
    description: 'Fear of birds',
    category: 'animal',
  },

  // Natural environment phobias
  {
    id: 'acrophobia',
    name: 'Acrophobia',
    description: 'Fear of heights',
    category: 'natural',
  },
  {
    id: 'aquaphobia',
    name: 'Aquaphobia',
    description: 'Fear of water',
    category: 'natural',
  },
  {
    id: 'astraphobia',
    name: 'Astraphobia',
    description: 'Fear of thunder and lightning',
    category: 'natural',
  },
  {
    id: 'nyctophobia',
    name: 'Nyctophobia',
    description: 'Fear of darkness',
    category: 'natural',
  },

  // Blood-injection-injury phobias
  {
    id: 'hemophobia',
    name: 'Hemophobia',
    description: 'Fear of blood',
    category: 'blood',
  },
  {
    id: 'trypanophobia',
    name: 'Trypanophobia',
    description: 'Fear of needles/injections',
    category: 'blood',
  },
  {
    id: 'traumatophobia',
    name: 'Traumatophobia',
    description: 'Fear of injury',
    category: 'blood',
  },

  // Situational phobias
  {
    id: 'claustrophobia',
    name: 'Claustrophobia',
    description: 'Fear of enclosed spaces',
    category: 'situational',
  },
  {
    id: 'aviophobia',
    name: 'Aviophobia',
    description: 'Fear of flying',
    category: 'situational',
  },
  {
    id: 'agoraphobia',
    name: 'Agoraphobia',
    description: 'Fear of open or crowded spaces',
    category: 'situational',
  },
  {
    id: 'dentophobia',
    name: 'Dentophobia',
    description: 'Fear of dentists',
    category: 'situational',
  },

  // Other specific phobias
  {
    id: 'trypophobia',
    name: 'Trypophobia',
    description: 'Fear of clusters of small holes',
    category: 'other',
  },
  {
    id: 'emetophobia',
    name: 'Emetophobia',
    description: 'Fear of vomiting',
    category: 'other',
  },
  {
    id: 'phonophobia',
    name: 'Phonophobia',
    description: 'Fear of loud noises',
    category: 'other',
  },
  {
    id: 'thanatophobia',
    name: 'Thanatophobia',
    description: 'Fear of death',
    category: 'other',
  },
  {
    id: 'necrophobia',
    name: 'Necrophobia',
    description: 'Fear of dead things',
    category: 'other',
  },
  {
    id: 'pyrophobia',
    name: 'Pyrophobia',
    description: 'Fear of fire',
    category: 'other',
  },
  {
    id: 'atychiphobia',
    name: 'Atychiphobia',
    description: 'Fear of failure',
    category: 'other',
  },
];

export function getPhobiaById(id: string): Phobia | undefined {
  return PHOBIAS.find((phobia) => phobia.id === id);
}
