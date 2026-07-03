// import { useState, useEffect, useCallback } from 'react';
// import FullCalendar from '@fullcalendar/react';
// import dayGridPlugin from '@fullcalendar/daygrid';
// import timeGridPlugin from '@fullcalendar/timegrid';
// import interactionPlugin from '@fullcalendar/interaction';
// import Box from '@mui/material/Box';
// import Paper from '@mui/material/Paper';
// import Typography from '@mui/material/Typography';
// import Button from '@mui/material/Button';
// import AddIcon from '@mui/icons-material/Add';
// import { planningService } from '../../services/Planningservice';
// import { regulatoryEventService } from '../../services/regulatoryEventService';
// import RegulatoryEventForm from '../../components/regulatory/RegulatoryEventForm';

// export default function UnifiedCalendarPage() {
//   const [events, setEvents] = useState<any[]>([]);
//   const [formOpen, setFormOpen] = useState(false);
//   const [selectedDate, setSelectedDate] = useState('');

//   const loadAllEvents = useCallback(async () => {
//     try {
//       const currentYear = new Date().getFullYear();
      
//       // Récupération simultanée via vos deux services nettoyés
//       const [plannings, regulatoryEvents] = await Promise.all([
//         planningService.getAll({ annee: currentYear }),
//         regulatoryEventService.getAll()
//       ]);

//       // Transformation des plannings de surveillance hebdomadaires (S1-S52)
//       const formattedPlannings = plannings.map((p: any) => {
//         const dateFromWeek = new Date(p.annee, 0, 1 + (p.semaine - 1) * 7);
//         return {
//           id: `plan-${p.id}`,
//           title: `🔍 [Inspection] ${p.domaine} - ${p.site}`,
//           start: dateFromWeek.toISOString().split('T')[0],
//           backgroundColor: p.statut === 'REALISE' ? '#2E7D32' : p.statut === 'EN_COURS' ? '#ED6C02' : p.statut === 'EN_RETARD' ? '#C62828' : '#1565C0',
//           borderColor: 'transparent',
//           extendedProps: { type: 'planning', data: p }
//         };
//       });

//       // Transformation des obligations réglementaires (US8)
//       const formattedRegulatory = regulatoryEvents.map((r: any) => ({
//         id: `reg-${r.id}`,
//         title: `⚠️ [Reg] ${r.titre}`,
//         start: r.datePrevue.split('T')[0],
//         backgroundColor: '#7B1FA2', // Couleur violette distinctive
//         borderColor: 'transparent',
//         extendedProps: { type: 'regulatory', data: r }
//       }));

//       setEvents([...formattedPlannings, ...formattedRegulatory]);
//     } catch (err) {
//       console.error("Erreur lors du chargement des événements unifiés", err);
//     }
//   }, []);

//   useEffect(() => {
//     loadAllEvents();
//   }, [loadAllEvents]);

//   const handleDateClick = (arg: any) => {
//     setSelectedDate(arg.dateStr);
//     setFormOpen(true);
//   };

//   return (
//     <Box p={3}>
//       <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
//         <Box>
//           <Typography variant="h5" fontWeight={700}>Calendrier HSEE Unifié</Typography>
//           <Typography variant="body2" color="text.secondary">
//             Suivi centralisé des inspections opérationnelles et obligations réglementaires.
//           </Typography>
//         </Box>
//         <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setSelectedDate(''); setFormOpen(true); }}>
//           Nouvelle Obligation
//         </Button>
//       </Box>

//       <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
//         <FullCalendar
//           plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
//           initialView="dayGridMonth"
//           headerToolbar={{
//             left: 'prev,next today',
//             center: 'title',
//             right: 'dayGridMonth,timeGridWeek,timeGridDay'
//           }}
//           locale="fr"
//           buttonText={{ today: "Aujourd'hui", month: 'Mois', week: 'Semaine', day: 'Jour' }}
//           events={events}
//           dateClick={handleDateClick}
//           eventClick={(info) => {
//             alert(`Événement sélectionné : ${info.event.title}\nType: ${info.event.extendedProps.type}`);
//           }}
//           height="75vh"
//         />
//       </Paper>

//       <RegulatoryEventForm
//         open={formOpen}
//         onClose={() => setFormOpen(false)}
//         onSuccess={loadAllEvents}
//         selectedDate={selectedDate}
//       />
//     </Box>
//   );
// }


import { useState, useEffect, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { planningService } from '../../services/Planningservice';
import { regulatoryEventService } from '../../services/regulatoryEventService';
import RegulatoryEventForm from '../../components/regulatory/RegulatoryEventForm';

export default function UnifiedCalendarPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');

  const loadAllEvents = useCallback(async () => {
    try {
      const currentYear = new Date().getFullYear();
      
      const [plannings, regulatoryEvents] = await Promise.all([
        planningService.getAll({ annee: currentYear }),
        regulatoryEventService.getAll()
      ]);

      const formattedPlannings = plannings.map((p: any) => {
        const dateFromWeek = new Date(p.annee, 0, 1 + (p.semaine - 1) * 7);
        return {
          id: `plan-${p.id}`,
          title: `🔍 [Inspection] ${p.domaine} - ${p.site}`,
          start: dateFromWeek.toISOString().split('T')[0],
          backgroundColor: p.statut === 'REALISE' ? '#2E7D32' : p.statut === 'EN_COURS' ? '#ED6C02' : p.statut === 'EN_RETARD' ? '#C62828' : '#1565C0',
          borderColor: 'transparent',
          extendedProps: { type: 'planning', data: p }
        };
      });

      const formattedRegulatory = regulatoryEvents.map((r: any) => ({
        id: `reg-${r.id}`,
        title: `⚠️ [Reg] ${r.titre || r.libelle}`,
        start: r.datePrevue.split('T')[0],
        backgroundColor: '#7B1FA2',
        borderColor: 'transparent',
        extendedProps: { type: 'regulatory', data: r }
      }));

      setEvents([...formattedPlannings, ...formattedRegulatory]);
    } catch (err) {
      console.error("Erreur lors du chargement des événements unifiés", err);
    }
  }, []);

  useEffect(() => {
    loadAllEvents();
  }, [loadAllEvents]);

  const handleDateClick = (arg: any) => {
    setSelectedDate(arg.dateStr);
    setFormOpen(true);
  };

  return (
    <Box p={3} sx={{ width: '100%', maxWidth: '100%', mx: 'auto' }}>
      <Box display="flex" justifyContent="between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Box>
          <Typography variant="h5" fontWeight={700}>Calendrier HSEE Unifié</Typography>
          <Typography variant="body2" color="text.secondary">
            Suivi centralisé des inspections opérationnelles et obligations réglementaires.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setSelectedDate(''); setFormOpen(true); }}>
          Nouvelle Obligation
        </Button>
      </Box>

      <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, width: '100%' }}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          locale="fr"
          buttonText={{ today: "Aujourd'hui", month: 'Mois', week: 'Semaine', day: 'Jour' }}
          events={events}
          dateClick={handleDateClick}
          eventClick={(info) => {
            alert(`Événement sélectionné : ${info.event.title}\nType: ${info.event.extendedProps.type}`);
          }}
          height="82vh"
        />
      </Paper>

      {/* Rendu conditionnel ou modal si vous l'utilisez en pop-in */}
      <RegulatoryEventForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSuccess={loadAllEvents}
        selectedDate={selectedDate}
      />
    </Box>
  );
}