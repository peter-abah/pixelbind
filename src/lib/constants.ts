export const MARGINS = {
  normal: 0.05,
  large: 0.095,
  small: 0.02,
  none: 0,
};

export const ACCEPTED_IMAGE_TYPES = ["jpg", "jpeg", "png", "webp", "bmp", "gif", "tiff"] as const;

export const ACCEPTED_IMAGE_TYPES_WITH_PERIOD = ACCEPTED_IMAGE_TYPES.map((s) => `.${s}`);
