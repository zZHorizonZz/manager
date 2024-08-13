import controller from './vps-dashboard.controller';
import template from './vps-dashboard.html';

export default {
  bindings: {
    connectedUser: '<',
    engagement: '<',
    features: '<',

    goToDisplayIps: '<',
    goToKvm: '<',
    goToMonitoringSla: '<',
    goToReboot: '<',
    goToRebootRescue: '<',
    goToReinstall: '<',
    goToReverseDns: '<',
    goToSnapshotDelete: '<',
    goToSnapshotTake: '<',
    goToSnapshotRestore: '<',
    goToSnapshotDownload: '<',
    goToTerminateOption: '<',
    goToVpsMigration: '<',
    goBack: '<',
    goToCommit: '<',
    goToCancelCommit: '<',
    goToCancelResiliation: '<',
    goToResiliation: '<',
    isCommitmentAvailable: '<',
    hasBackupStorage: '<',
    canScheduleMigration: '<',
    isMigrating: '<',
    isVpsNewRange: '<',
    plan: '<',
    serviceInfo: '<',
    serviceName: '<',
    shouldReengage: '<',
    stateVps: '<',
    tabSummary: '<',
    trackingPrefix: '<',
    vps: '<',
    vpsState: '<',
    vpsMigration: '<',
    vpsMigrationTask: '<',
    vpsMigrationTaskInError: '<',
    vpsUpgradeTask: '<',
    canDisplayVpsAnnouncementBanner: '<',
    migrationLink: '<',
    user: '<',
    stein: '<',
    isVpsMaintenance: '<',
    trackPage: '<',
    isSecondaryDnsAvailable: '<',
  },
  controller,
  name: 'ovhManagerVpsDashboard',
  template,
};
