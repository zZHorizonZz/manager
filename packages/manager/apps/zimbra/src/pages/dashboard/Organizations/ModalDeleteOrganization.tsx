import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_COLOR_HUE,
} from '@ovhcloud/ods-common-theming';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { OsdsMessage, OsdsText } from '@ovhcloud/ods-components/react';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useDomains, usePlatform } from '@/hooks';
import { deleteZimbraPlatformOrganization } from '@/api/organization';
import Modal from '@/components/Modals/Modal';

export default function ModalDeleteOrganization() {
  const [searchParams] = useSearchParams();
  const deleteOrganizationId = searchParams.get('deleteOrganizationId');
  const { t } = useTranslation('organizations/delete');
  const { platformId } = usePlatform();
  const { addError, addSuccess } = useNotifications();
  const [hasDomain, setHasDomain] = useState(false);
  const navigate = useNavigate();

  const onClose = () => navigate('..');

  const handleDeleteClick = () => {
    deleteZimbraPlatformOrganization(platformId, deleteOrganizationId)
      .then(() => {
        onClose();
        addSuccess(
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            size={ODS_THEME_TYPOGRAPHY_SIZE._100}
            level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
            hue={ODS_THEME_COLOR_HUE._500}
          >
            {t('zimbra_organization_delete_success_message')}
          </OsdsText>,
          true,
        );
      })
      .catch(({ response }) => {
        onClose();
        addError(
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            size={ODS_THEME_TYPOGRAPHY_SIZE._100}
            level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
            hue={ODS_THEME_COLOR_HUE._500}
          >
            {t('zimbra_organization_delete_error_message', {
              error: response.data.message,
            })}
          </OsdsText>,
          true,
        );
      });
  };

  const { data, isLoading } = useDomains(deleteOrganizationId);

  useEffect(() => {
    setHasDomain(data?.length > 0);
  }, [isLoading]);

  return (
    <Modal
      title={t('zimbra_organization_delete_modal_title')}
      color={ODS_THEME_COLOR_INTENT.warning}
      onDismissible={onClose}
      dismissible={true}
      isLoading={isLoading}
      primaryButton={{
        testid: 'delete-btn',
        color: ODS_THEME_COLOR_INTENT.primary,
        label: t('zimbra_organization_delete'),
        action: handleDeleteClick,
        disabled: hasDomain,
      }}
    >
      <>
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          size={ODS_THEME_TYPOGRAPHY_SIZE._100}
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          hue={ODS_THEME_COLOR_HUE._500}
        >
          {t('zimbra_organization_delete_modal_content')}
        </OsdsText>

        {hasDomain && (
          <OsdsMessage
            color={ODS_THEME_COLOR_INTENT.error}
            icon={ODS_ICON_NAME.WARNING_CIRCLE}
            className="mt-4"
            data-testid="banner-message"
          >
            <div className="flex flex-col text-left ml-4">
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                size={ODS_THEME_TYPOGRAPHY_SIZE._100}
                level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
                hue={ODS_THEME_COLOR_HUE._500}
              >
                {t('zimbra_organization_delete_modal_message_disabled_part1')}
              </OsdsText>
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                size={ODS_THEME_TYPOGRAPHY_SIZE._100}
                level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                hue={ODS_THEME_COLOR_HUE._500}
              >
                {t('zimbra_organization_delete_modal_message_disabled_part2')}
              </OsdsText>
            </div>
          </OsdsMessage>
        )}
      </>
    </Modal>
  );
}
