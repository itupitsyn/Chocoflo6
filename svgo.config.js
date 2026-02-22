module.exports = {
  multipass: true,
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          cleanupIds: false, // Отключаем, чтобы не удалил "нужные" ID
          removeViewBox: false,
        },
      },
    },
    {
      name: 'prefixIds',
      params: {
        // Принудительно заставляем обрабатывать clipPath
        prefixIds: true,
        // И класснеймы тоже, на всякий случай
        prefixClassNames: true,
      },
    },
  ],
};
