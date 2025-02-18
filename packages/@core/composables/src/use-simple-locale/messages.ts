export type Locale = 'en-US' | 'zh-CN';

export const messages: Record<Locale, Record<string, string>> = {
  'en-US': {
    cancel: 'Cancel',
    collapse: 'Collapse',
    confirm: 'Confirm',
    expand: 'Expand',
    reset: 'Reset',
    submit: 'Submit',
    captchaTitle: 'Please complete the security verification',
    sliderSuccessText: 'Passed',
    sliderDefaultText: 'Slider and drag',
    alt: 'Supports img tag src attribute value',
    sliderRotateDefaultTip: 'Click picture to refresh',
    sliderRotateFailTip: 'Validation failed',
    sliderRotateSuccessTip: 'Validation successful, time ',
    seconds: ' seconds',
    refreshAriaLabel: 'Refresh captcha',
    confirmAriaLabel: 'Confirm selection',
    pointAriaLabel: 'Click point',
    clickInOrder: 'Please click in order',
  },
  'zh-CN': {
    cancel: '取消',
    collapse: '收起',
    confirm: '确认',
    expand: '展开',
    reset: '重置',
    submit: '提交',
    captchaTitle: '请完成安全验证',
    sliderSuccessText: '验证通过',
    sliderDefaultText: '请按住滑块拖动',
    sliderRotateDefaultTip: '点击图片可刷新',
    sliderRotateFailTip: '验证失败',
    sliderRotateSuccessTip: '验证成功，耗时',
    seconds: '秒',
    alt: '支持img标签src属性值',
    refreshAriaLabel: '刷新验证码',
    confirmAriaLabel: '确认选择',
    pointAriaLabel: '点击点',
    clickInOrder: '请依次点击',
  },
};

export const getMessages = (locale: Locale) => messages[locale];
