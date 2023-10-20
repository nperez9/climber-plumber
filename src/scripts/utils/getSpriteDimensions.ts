import { Scene } from 'phaser';
import { Sprites } from '../constants';

/**
 * Returns the width and the height of a loaded sprites. (is only usable after preload scene)
 * @param scene Phaser Scene (this)
 * @param sprite Sprite key
 * @returns
 */
export const getSpriteDimension = (scene: Scene, spriteKey: string): { width: number; height: number } => {
  const width = scene.textures.get(spriteKey).get(0).width;
  const height = scene.textures.get(spriteKey).get(0).height;

  return {
    width,
    height,
  };
};
