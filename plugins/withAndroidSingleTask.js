const { withAndroidManifest } = require('expo/config-plugins');

function setSingleTaskOnMainActivity(androidManifest) {
  const mainApplication = androidManifest?.manifest?.application?.[0];
  if (!mainApplication) return androidManifest;

  const activities = mainApplication.activity ?? [];

  const isMainLauncherActivity = (activity) => {
    const intentFilters = activity?.['intent-filter'] ?? [];
    for (const filter of intentFilters) {
      const actions = filter?.action ?? [];
      const categories = filter?.category ?? [];

      const hasMainAction = actions.some(
        (a) => a?.$?.['android:name'] === 'android.intent.action.MAIN'
      );
      const hasLauncherCategory = categories.some(
        (c) => c?.$?.['android:name'] === 'android.intent.category.LAUNCHER'
      );

      if (hasMainAction && hasLauncherCategory) return true;
    }
    return false;
  };

  const getActivityName = (activity) => activity?.$?.['android:name'];

  const mainActivity =
    activities.find((a) => getActivityName(a) === '.MainActivity') ||
    activities.find((a) => getActivityName(a)?.endsWith('.MainActivity')) ||
    activities.find(isMainLauncherActivity);

  if (!mainActivity) return androidManifest;

  mainActivity.$ = mainActivity.$ ?? {};
  mainActivity.$['android:launchMode'] = 'singleTask';

  return androidManifest;
}

module.exports = function withAndroidSingleTask(config) {
  return withAndroidManifest(config, (config) => {
    config.modResults = setSingleTaskOnMainActivity(config.modResults);
    return config;
  });
};
