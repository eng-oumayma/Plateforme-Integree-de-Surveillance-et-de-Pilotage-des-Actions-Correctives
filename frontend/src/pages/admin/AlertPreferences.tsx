import React, { useState, useEffect } from 'react';

interface AlertSetting {
  id: string;
  key: string;
  label: string;
  description: string;
  enabledForRoles: { ADMIN: boolean; AUDITEUR: boolean; PILOTE: boolean };
}

export const AlertPreferences: React.FC = () => {
  const [settings, setSettings] = useState<AlertSetting[]>([
    {
      id: '1',
      key: 'overdue_inspection',
      label: 'Détection des Inspections en Retard',
      description: 'Alerte journalière si une inspection planifiée dépasse sa semaine ISO.',
      enabledForRoles: { ADMIN: true, AUDITEUR: true, PILOTE: false },
    },
    {
      id: '2',
      key: 'action_reminders',
      label: 'Rappels Échéance Actions (J-3 / J-1)',
      description: 'Aviser automatiquement le pilote avant l\'expiration de son action.',
      enabledForRoles: { ADMIN: false, AUDITEUR: false, PILOTE: true },
    },
    {
      id: '3',
      key: 'weekly_report',
      label: 'Rapport Hebdomadaire Admin',
      description: 'Envoi d\'un récapitulatif groupé de toutes les actions hors délais tous les lundis.',
      enabledForRoles: { ADMIN: true, AUDITEUR: false, PILOTE: false },
    },
    {
      id: '4',
      key: 'regulatory_events',
      label: 'Échéances Réglementaires (J-30 / J-7)',
      description: 'Rappels des obligations légales et audits réglementaires.',
      enabledForRoles: { ADMIN: true, AUDITEUR: true, PILOTE: false },
    },
  ]);

  const [saving, setSaving] = useState(false);

  const handleToggle = (settingId: string, role: 'ADMIN' | 'AUDITEUR' | 'PILOTE') => {
    setSettings((prev) =>
      prev.map((set) => {
        if (set.id === settingId) {
          return {
            ...set,
            enabledForRoles: {
              ...set.enabledForRoles,
              [role]: !set.enabledForRoles[role],
            },
          };
        }
        return set;
      })
    );
  };

  const savePreferences = async () => {
    setSaving(true);
    try {
      // Exemple d'appel API :
      // await axios.put('/api/settings/alerts', { settings });
      console.log('Préférences sauvegardées en BDD :', settings);
      alert('Préférences de l\'US24 enregistrées avec succès !');
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="border-b border-gray-200 pb-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">🟨 Configuration des Alertes & Notifications</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gérez l'activation et le ciblage des alertes automatiques générées par les tâches de fond (Cron).
          </p>
        </div>

        <div className="space-y-6">
          {settings.map((setting) => (
            <div key={setting.id} className="p-4 bg-gray-50 rounded-lg border border-gray-150 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="max-w-md">
                <h3 className="font-semibold text-gray-800 text-base">{setting.label}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{setting.description}</p>
              </div>

              {/* Rôles cibles */}
              <div className="flex gap-4 items-center">
                {(['ADMIN', 'AUDITEUR', 'PILOTE'] as const).map((role) => (
                  <label key={role} className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded border border-gray-200 cursor-pointer text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                    <input
                      type="checkbox"
                      className="rounded text-yellow-600 focus:ring-yellow-500 h-3.5 w-3.5 border-gray-300"
                      checked={setting.enabledForRoles[role]}
                      onChange={() => handleToggle(setting.id, role)}
                    />
                    <span>{role}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={savePreferences}
            disabled={saving}
            className="px-5 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg text-sm shadow transition-all disabled:opacity-50"
          >
            {saving ? 'Sauvegarde...' : 'Enregistrer les configurations'}
          </button>
        </div>
      </div>
    </div>
  );
};