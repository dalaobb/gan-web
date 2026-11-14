import { removeBackground } from '@/lib/utils/remover';
import { isMobileDevice } from '@/lib/utils/remover/utils';
import { smallModelKey } from '@/lib/utils/const';
import { ImageType } from '@/lib/types';

const MODEL_CDN = 'https://cdn.bgg.one/remove-bg/model/1.5.3/';

export function removeLocalBackground(file: Blob) {
  const small =
    typeof window !== 'undefined' &&
    !!window.localStorage.getItem(smallModelKey);
  return removeBackground(file, {
    device: 'gpu',
    publicPath: MODEL_CDN,
    proxyToWorker: true,
    debug: false,
    model: small || isMobileDevice() ? 'isnet_quint8' : 'isnet',
    output: { format: ImageType.PNG, quality: 1 },
  });
}
