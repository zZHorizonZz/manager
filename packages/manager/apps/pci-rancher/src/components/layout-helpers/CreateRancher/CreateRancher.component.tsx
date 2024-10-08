import {
  PciDiscoveryBanner,
  Subtitle,
  Title,
} from '@ovh-ux/manager-react-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { Trans, useTranslation } from 'react-i18next';
import {
  ODS_BUTTON_VARIANT,
  ODS_INPUT_TYPE,
  ODS_MESSAGE_TYPE,
  ODS_TEXT_LEVEL,
  OdsInputValueChangeEventDetail,
  OsdsInputCustomEvent,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsChip,
  OsdsInput,
  OsdsMessage,
  OsdsText,
  OsdsTile,
} from '@ovhcloud/ods-components/react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  CreateRancherPayload,
  RancherPlan,
  RancherVersion,
} from '@/types/api.type';
import Block from '@/components/Block/Block.component';
import {
  useTrackingAction,
  useSimpleTrackingAction,
} from '@/hooks/useTrackingPage/useTrackingPage';
import { isValidRancherName } from '@/utils/rancher';
import { getRanchersUrl } from '@/utils/route';
import { TrackingEvent, TrackingPageView } from '@/utils/tracking';

const TileSection: React.FC<{
  name: string;
  isActive: boolean;
  description?: string;
  chipLabel?: string;
  onClick: () => void;
  isDisabled: boolean;
}> = ({ name, isActive, description, chipLabel, onClick, isDisabled }) => (
  <OsdsTile
    aria-label={`tile-${name}`}
    disabled={isDisabled || undefined}
    checked={isActive || undefined}
    color={
      isActive ? ODS_THEME_COLOR_INTENT.primary : ODS_THEME_COLOR_INTENT.default
    }
    className="w-1/3 mr-5"
    onClick={() => {
      if (!isDisabled) {
        onClick();
      }
    }}
  >
    <span slot="start">
      <div className="flex flex-col">
        <div className="flex items-center flex-wrap">
          <OsdsText
            level={ODS_TEXT_LEVEL.heading}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {name}
          </OsdsText>
          {chipLabel ? (
            <OsdsChip
              color={ODS_THEME_COLOR_INTENT.primary}
              className="lg:ml-5"
            >
              {chipLabel}
            </OsdsChip>
          ) : (
            <></>
          )}
        </div>
        <Block>
          <OsdsText color={ODS_THEME_COLOR_INTENT.text}>{description}</OsdsText>
        </Block>
      </div>
    </span>
  </OsdsTile>
);

const getRancherPlanDescription = (rancherPlan: RancherPlan['name']) => {
  switch (rancherPlan) {
    case 'STANDARD':
      return 'createRancherStandardPlanDescription';
    case 'OVHCLOUD_EDITION':
      return 'createRancherOVHCloudPlanDescription';
    default:
      return null;
  }
};

export interface CreateRancherProps {
  projectId: string;
  plans: RancherPlan[];
  versions: RancherVersion[];
  hasRancherCreationError: boolean;
  rancherCreationErrorMessage?: string | null;
  onCreateRancher: (payload: CreateRancherPayload) => void;
  isProjectDiscoveryMode?: boolean;
  isCreateRancherLoading: boolean;
}

const CreateRancher: React.FC<CreateRancherProps> = ({
  plans,
  versions,
  onCreateRancher,
  hasRancherCreationError,
  rancherCreationErrorMessage,
  projectId,
  isProjectDiscoveryMode,
  isCreateRancherLoading,
}) => {
  const [rancherName, setRancherName] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedVersion, setSelectedVersion] = useState(null);

  const navigate = useNavigate();

  const isValidName = rancherName !== '' && isValidRancherName(rancherName);
  const hasInputError = rancherName !== '' && !isValidName;
  const isCreateRancherAllowed = isValidName && !isProjectDiscoveryMode;

  const { t } = useTranslation(['dashboard', 'listing']);
  const trackAction = useTrackingAction();
  const simpleTrackAction = useSimpleTrackingAction();

  useEffect(() => {
    if (selectedPlan === null && plans?.length) {
      setSelectedPlan(plans?.filter((v) => v.status === 'AVAILABLE')[0]);
    }

    if (selectedVersion === null && versions?.length) {
      const availableVersions = versions.filter(
        (version) => version.status === 'AVAILABLE',
      );
      const versionToBeSelected = availableVersions.reduce(
        (maxVersion, currentVersion) => {
          return currentVersion.name > maxVersion.name
            ? currentVersion
            : maxVersion;
        },
        availableVersions[0],
      );
      versionToBeSelected.description = t('createRancherRecomendedVersion');
      setSelectedVersion(versionToBeSelected);
    }
  }, [versions, plans]);

  const onCreateClick = (rancherPayload: CreateRancherPayload) => {
    trackAction(TrackingPageView.CreateRancher, TrackingEvent.confirm);
    simpleTrackAction(
      `rancher-creation::${rancherPayload.plan}::${rancherPayload.version}`,
    );

    onCreateRancher(rancherPayload);
  };

  const onCancelClick = () => {
    trackAction(TrackingPageView.CreateRancher, TrackingEvent.cancel);
    navigate(getRanchersUrl(projectId));
  };

  const sortedVersions: RancherVersion[] = versions?.sort((a, b) =>
    b.name.localeCompare(a.name),
  );

  return (
    <div>
      <Title>{t('createRancherTitle')}</Title>
      {isProjectDiscoveryMode && <PciDiscoveryBanner projectId={projectId} />}
      <OsdsMessage
        color={ODS_THEME_COLOR_INTENT.info}
        type={ODS_MESSAGE_TYPE.info}
        className="my-6"
      >
        <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
          <Trans> {t('createRancherInfoMessage')}</Trans> <br />
        </OsdsText>
      </OsdsMessage>
      {hasRancherCreationError && (
        <OsdsMessage
          color={ODS_THEME_COLOR_INTENT.error}
          type={ODS_MESSAGE_TYPE.error}
          className="my-6"
        >
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            data-testid="errorBanner"
          >
            {t('createRancherError', {
              rancherCreationErrorMessage,
            })}
            <br />
          </OsdsText>
        </OsdsMessage>
      )}
      <div>
        <div className="mb-8">
          <Block>
            <Subtitle>{t('createRancherName')}</Subtitle>
          </Block>
          <Block>
            <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
              {t('createRancherDescription')}
            </OsdsText>
          </Block>
          <OsdsInput
            placeholder={t('createRancherPlaceholder')}
            aria-label="rancher-name-input"
            type={ODS_INPUT_TYPE.text}
            color={
              hasInputError
                ? ODS_THEME_COLOR_INTENT.error
                : ODS_THEME_COLOR_INTENT.primary
            }
            className="my-3 w-1/3"
            value={rancherName}
            onOdsValueChange={(
              e: OsdsInputCustomEvent<OdsInputValueChangeEventDetail>,
            ) => setRancherName(e.target.value as string)}
          />

          <OsdsText
            color={
              hasInputError
                ? ODS_THEME_COLOR_INTENT.error
                : ODS_THEME_COLOR_INTENT.text
            }
          >
            {t('createNameModaleHelperInput')}
          </OsdsText>
        </div>

        <div className="my-3">
          <Subtitle>{t('createRancherServiceLevel')}</Subtitle>
        </div>
        <div className="max-w-3xl">
          <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
            {t('createRancherServiceLevelDescription')}
          </OsdsText>
        </div>
        <div className="flex my-5">
          {plans?.map((plan) => (
            <TileSection
              key={plan.name}
              isActive={plan.name === selectedPlan?.name}
              isDisabled={plan.status !== 'AVAILABLE'}
              name={t(plan.name)}
              description={t(getRancherPlanDescription(plan.name))}
              chipLabel={
                plan.name === 'OVHCLOUD_EDITION' ? t('comingSoon') : ''
              }
              onClick={() => setSelectedPlan(plan)}
            />
          ))}
        </div>

        <Block>
          <Subtitle>{t('createRancherVersion')}</Subtitle>
        </Block>

        <Block>
          <div className="max-w-3xl">
            <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
              {t('createRancherVersionDescription')}
            </OsdsText>
          </div>
        </Block>
        <div className="flex my-5">
          {sortedVersions?.map((version) => (
            <TileSection
              key={version.name}
              isActive={version.name === selectedVersion?.name}
              name={version.name}
              description={version.description}
              isDisabled={version.status !== 'AVAILABLE'}
              onClick={() => setSelectedVersion(version)}
            />
          ))}
        </div>

        <div className="flex mt-8">
          <OsdsButton
            className="mr-4"
            slot="actions"
            variant={ODS_BUTTON_VARIANT.stroked}
            color={ODS_THEME_COLOR_INTENT.primary}
            onClick={onCancelClick}
          >
            {t('cancel')}
          </OsdsButton>
          <OsdsButton
            disabled={
              !isCreateRancherAllowed || isCreateRancherLoading || undefined
            }
            slot="actions"
            color={ODS_THEME_COLOR_INTENT.primary}
            onClick={() => {
              if (isCreateRancherAllowed || isCreateRancherLoading) {
                onCreateClick({
                  name: rancherName,
                  version: selectedVersion.name,
                  plan: selectedPlan.name,
                });
              }
            }}
          >
            {t('createRancherCTA')}
          </OsdsButton>
        </div>
      </div>
    </div>
  );
};

export default CreateRancher;
