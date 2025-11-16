import React from 'react';
import {
  CodeIcon,
  DesktopIcon,
  MobileIcon,
  GlobeIcon,
  RocketIcon,
  CubeIcon,
  MixIcon,
  GearIcon,
  LayersIcon,
  VideoIcon,
  CameraIcon,
  ImageIcon,
  SymbolIcon,
  PersonIcon,
  ChatBubbleIcon,
  SpeakerLoudIcon,
  EnvelopeClosedIcon,
  LightningBoltIcon,
  ReaderIcon,
  BarChartIcon,
  MagnifyingGlassIcon,
  StarIcon,
  CheckIcon,
  BackpackIcon,
  ClipboardIcon,
  FileIcon,
  ArchiveIcon,
  Component1Icon,
  Component2Icon,
} from '@radix-ui/react-icons';

export type IconName =
  // Technology & Electronics
  | 'circuit'
  | 'code'
  | 'monitor'
  | 'smartphone'
  | 'cpu'
  | 'database'
  | 'cloud'
  | 'globe'
  // Engineering & Design
  | 'airplane'
  | 'robot'
  | 'wrench'
  | 'settings'
  | 'compass'
  | 'layers'
  | 'target'
  | 'cog'
  // VR & Creative
  | 'vr'
  | 'gamepad'
  | 'palette'
  | 'camera'
  | 'film'
  | 'music'
  // Collaboration & Communication
  | 'users'
  | 'message'
  | 'megaphone'
  | 'handshake'
  | 'mail'
  | 'phone'
  // Learning & Analysis
  | 'brain'
  | 'book'
  | 'graduation'
  | 'chart'
  | 'microscope'
  | 'search'
  | 'zap'
  // Achievement & Quality
  | 'trophy'
  | 'star'
  | 'check'
  | 'medal'
  | 'diamond'
  // Business & Projects
  | 'briefcase'
  | 'clipboard'
  | 'folder'
  | 'package'
  | 'rocket';

const iconMap: Record<IconName, React.ComponentType<{ className?: string }>> = {
  // Technology & Electronics
  circuit: Component1Icon,
  code: CodeIcon,
  monitor: DesktopIcon,
  smartphone: MobileIcon,
  cpu: Component2Icon,
  database: ArchiveIcon,
  cloud: Component1Icon,
  globe: GlobeIcon,

  // Engineering & Design
  airplane: RocketIcon,
  robot: CubeIcon,
  wrench: MixIcon,
  settings: GearIcon,
  compass: Component2Icon,
  layers: LayersIcon,
  target: Component1Icon,
  cog: GearIcon,

  // VR & Creative
  vr: VideoIcon,
  gamepad: Component2Icon,
  palette: ImageIcon,
  camera: CameraIcon,
  film: VideoIcon,
  music: SymbolIcon,

  // Collaboration & Communication
  users: PersonIcon,
  message: ChatBubbleIcon,
  megaphone: SpeakerLoudIcon,
  handshake: PersonIcon,
  mail: EnvelopeClosedIcon,
  phone: EnvelopeClosedIcon,

  // Learning & Analysis
  brain: LightningBoltIcon,
  book: ReaderIcon,
  graduation: ReaderIcon,
  chart: BarChartIcon,
  microscope: MagnifyingGlassIcon,
  search: MagnifyingGlassIcon,
  zap: LightningBoltIcon,

  // Achievement & Quality
  trophy: StarIcon,
  star: StarIcon,
  check: CheckIcon,
  medal: StarIcon,
  diamond: StarIcon,

  // Business & Projects
  briefcase: BackpackIcon,
  clipboard: ClipboardIcon,
  folder: FileIcon,
  package: ArchiveIcon,
  rocket: RocketIcon,
};

interface IconProps {
  name?: IconName | string;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({ name, className = '' }) => {
  if (!name || !(name in iconMap)) {
    return null;
  }

  const IconComponent = iconMap[name as IconName];
  return <IconComponent className={className} />;
};

export default Icon;
