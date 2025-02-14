import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  clean: true,
  declaration: true,
  entries: [
    'src/store/index',
    'src/constants/index',
    'src/utils/index',
    'src/color/index',
    'src/cache/index',
    'src/global-state/index',
  ],
});
