--
-- PostgreSQL database dump
--

\restrict eLfOfraffsNahXgA4VoupZ9dGG0oDkR0oSjVf10sir1urlpmMMgOl5ojupge7d0

-- Dumped from database version 18.4 (Debian 18.4-1.pgdg13+1)
-- Dumped by pg_dump version 18.4 (Debian 18.4-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: action_proofs_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.action_proofs_type_enum AS ENUM (
    'PHOTO',
    'DOCUMENT',
    'CERTIFICAT'
);


ALTER TYPE public.action_proofs_type_enum OWNER TO postgres;

--
-- Name: anomalies_criticite_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.anomalies_criticite_enum AS ENUM (
    'FAIBLE',
    'MODERE',
    'CRITIQUE',
    'BLOQUANT'
);


ALTER TYPE public.anomalies_criticite_enum OWNER TO postgres;

--
-- Name: anomalies_statut_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.anomalies_statut_enum AS ENUM (
    'OUVERTE',
    'ACTION_CREEE',
    'EN_TRAITEMENT',
    'CLOTUREE'
);


ALTER TYPE public.anomalies_statut_enum OWNER TO postgres;

--
-- Name: checklist_templates_cotationtype_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.checklist_templates_cotationtype_enum AS ENUM (
    '0_1_2_NA',
    '0_1_2_3',
    '0_4_6_8_10',
    '0_1',
    '0_1_2',
    'TARGET'
);


ALTER TYPE public.checklist_templates_cotationtype_enum OWNER TO postgres;

--
-- Name: checklist_templates_domaine_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.checklist_templates_domaine_enum AS ENUM (
    'Plant',
    'Magasin',
    'Sanitaires',
    'Cantine',
    'Chimique',
    'Locaux_techniques',
    'Déchets',
    'Transport',
    'Infirmerie',
    'Recycleurs',
    'Incendie'
);


ALTER TYPE public.checklist_templates_domaine_enum OWNER TO postgres;

--
-- Name: corrective_actions_criticite_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.corrective_actions_criticite_enum AS ENUM (
    'FAIBLE',
    'MODERE',
    'CRITIQUE',
    'BLOQUANT'
);


ALTER TYPE public.corrective_actions_criticite_enum OWNER TO postgres;

--
-- Name: corrective_actions_statut_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.corrective_actions_statut_enum AS ENUM (
    'A_FAIRE',
    'EN_COURS',
    'TERMINEE',
    'VALIDEE',
    'REJETEE'
);


ALTER TYPE public.corrective_actions_statut_enum OWNER TO postgres;

--
-- Name: inspections_domaine_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.inspections_domaine_enum AS ENUM (
    'Plant',
    'Magasin',
    'Sanitaires',
    'Cantine',
    'Chimique',
    'Locaux_techniques',
    'Déchets',
    'Transport',
    'Infirmerie',
    'Recycleurs',
    'Incendie'
);


ALTER TYPE public.inspections_domaine_enum OWNER TO postgres;

--
-- Name: inspections_statut_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.inspections_statut_enum AS ENUM (
    'PLANIFIE',
    'EN_COURS',
    'REALISE',
    'EN_RETARD',
    'ANNULEE'
);


ALTER TYPE public.inspections_statut_enum OWNER TO postgres;

--
-- Name: notifications_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.notifications_type_enum AS ENUM (
    'INSPECTION_CREEE',
    'INSPECTION_CLOTUREE',
    'INSPECTION_EN_RETARD',
    'PLAN_ASSIGNE',
    'PLAN_EN_RETARD',
    'EVENEMENT_ECHEANCE',
    'ACTION_ASSIGNEE',
    'ACTION_EN_RETARD',
    'ACTION_TERMINEE',
    'ACTION_VALIDEE',
    'ACTION_REJETEE',
    'ANOMALIE_DETECTEE',
    'SYSTEME',
    'ACTION_RAPPEL',
    'REPORT_HEBDO_ADMIN'
);


ALTER TYPE public.notifications_type_enum OWNER TO postgres;

--
-- Name: plan_surveillance_domaine_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.plan_surveillance_domaine_enum AS ENUM (
    'Plant',
    'Magasin',
    'Sanitaires',
    'Cantine',
    'Chimique',
    'Locaux_techniques',
    'Déchets',
    'Transport',
    'Infirmerie',
    'Recycleurs',
    'Incendie'
);


ALTER TYPE public.plan_surveillance_domaine_enum OWNER TO postgres;

--
-- Name: plan_surveillance_frequence_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.plan_surveillance_frequence_enum AS ENUM (
    'HEBDOMADAIRE',
    'MENSUEL',
    'TRIMESTRIEL',
    'ANNUEL'
);


ALTER TYPE public.plan_surveillance_frequence_enum OWNER TO postgres;

--
-- Name: plan_surveillance_statut_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.plan_surveillance_statut_enum AS ENUM (
    'PLANIFIE',
    'REALISE',
    'EN_RETARD',
    'ANNULE',
    'EN_COURS'
);


ALTER TYPE public.plan_surveillance_statut_enum OWNER TO postgres;

--
-- Name: regulatory_events_statut_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.regulatory_events_statut_enum AS ENUM (
    'PLANIFIE',
    'REALISE',
    'EN_RETARD',
    'ANNULE'
);


ALTER TYPE public.regulatory_events_statut_enum OWNER TO postgres;

--
-- Name: regulatory_events_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.regulatory_events_type_enum AS ENUM (
    'CONTROLE_REGLEMENTAIRE',
    'AUDIT_CERTIFICATION',
    'FORMATION',
    'CSST',
    'ANALYSES_EAU',
    'AUDIT_ENERGIE',
    'MEDECINE_TRAVAIL',
    'REVUE_DIRECTION',
    'CONTROLE_INCENDIE',
    'EXERCICE_EVACUATION',
    'MESURES_EMISSIONS'
);


ALTER TYPE public.regulatory_events_type_enum OWNER TO postgres;

--
-- Name: users_department_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.users_department_enum AS ENUM (
    'HSE',
    'Production',
    'Maintenance',
    'Qualité',
    'Logistique',
    'RH',
    'Direction'
);


ALTER TYPE public.users_department_enum OWNER TO postgres;

--
-- Name: users_role_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.users_role_enum AS ENUM (
    'ADMIN_HSEE',
    'AUDITEUR',
    'PILOTE_ACTION'
);


ALTER TYPE public.users_role_enum OWNER TO postgres;

--
-- Name: users_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.users_status_enum AS ENUM (
    'PENDING',
    'ACTIVE',
    'INACTIVE'
);


ALTER TYPE public.users_status_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: action_comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.action_comments (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "actionId" uuid NOT NULL,
    "authorId" uuid NOT NULL,
    message text NOT NULL,
    mentions text DEFAULT ''::text,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    action_id uuid,
    author_id uuid
);


ALTER TABLE public.action_comments OWNER TO postgres;

--
-- Name: action_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.action_history (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "actionId" uuid NOT NULL,
    "fromStatut" character varying NOT NULL,
    "toStatut" character varying NOT NULL,
    motif character varying,
    "changedById" uuid NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    action_id uuid
);


ALTER TABLE public.action_history OWNER TO postgres;

--
-- Name: action_proofs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.action_proofs (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "actionId" uuid NOT NULL,
    type public.action_proofs_type_enum NOT NULL,
    filename character varying NOT NULL,
    "originalName" character varying NOT NULL,
    url character varying NOT NULL,
    mimetype character varying NOT NULL,
    size integer NOT NULL,
    "uploadedById" uuid NOT NULL,
    "uploadedAt" timestamp without time zone DEFAULT now() NOT NULL,
    action_id uuid,
    uploaded_by_id uuid
);


ALTER TABLE public.action_proofs OWNER TO postgres;

--
-- Name: anomalies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.anomalies (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "inspectionId" uuid NOT NULL,
    description text NOT NULL,
    criticite public.anomalies_criticite_enum NOT NULL,
    statut public.anomalies_statut_enum DEFAULT 'OUVERTE'::public.anomalies_statut_enum NOT NULL,
    "createdById" uuid NOT NULL,
    domaine character varying,
    site character varying,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    checklist_item_id uuid
);


ALTER TABLE public.anomalies OWNER TO postgres;

--
-- Name: anomaly_photos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.anomaly_photos (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    filename character varying NOT NULL,
    url character varying NOT NULL,
    "originalName" character varying,
    "uploadedAt" timestamp without time zone DEFAULT now() NOT NULL,
    anomaly_id uuid
);


ALTER TABLE public.anomaly_photos OWNER TO postgres;

--
-- Name: checklist_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.checklist_items (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    section character varying NOT NULL,
    libelle character varying NOT NULL,
    target character varying,
    ordre integer DEFAULT 0 NOT NULL,
    actif boolean DEFAULT true NOT NULL,
    template_id uuid
);


ALTER TABLE public.checklist_items OWNER TO postgres;

--
-- Name: checklist_response_photos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.checklist_response_photos (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    filename character varying NOT NULL,
    url character varying NOT NULL,
    "originalName" character varying,
    "uploadedAt" timestamp without time zone DEFAULT now() NOT NULL,
    response_id uuid
);


ALTER TABLE public.checklist_response_photos OWNER TO postgres;

--
-- Name: checklist_responses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.checklist_responses (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "inspectionId" uuid NOT NULL,
    cotation character varying,
    observation text,
    "analyseCauses" text,
    responsable character varying,
    delai date,
    "isDeviation" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    item_id uuid
);


ALTER TABLE public.checklist_responses OWNER TO postgres;

--
-- Name: checklist_templates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.checklist_templates (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    domaine public.checklist_templates_domaine_enum NOT NULL,
    titre character varying NOT NULL,
    version integer DEFAULT 1 NOT NULL,
    "cotationType" public.checklist_templates_cotationtype_enum NOT NULL,
    actif boolean DEFAULT true NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.checklist_templates OWNER TO postgres;

--
-- Name: corrective_actions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.corrective_actions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "anomalyId" uuid NOT NULL,
    description text NOT NULL,
    criticite public.corrective_actions_criticite_enum NOT NULL,
    deadline date NOT NULL,
    "criteresValidation" text,
    statut public.corrective_actions_statut_enum DEFAULT 'A_FAIRE'::public.corrective_actions_statut_enum NOT NULL,
    "motifRejet" text,
    progression integer DEFAULT 0 NOT NULL,
    "piloteId" uuid NOT NULL,
    "createdById" uuid NOT NULL,
    "closedById" uuid,
    "closedAt" timestamp without time zone,
    domaine character varying,
    site character varying,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    anomaly_id uuid NOT NULL
);


ALTER TABLE public.corrective_actions OWNER TO postgres;

--
-- Name: inspections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inspections (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    domaine public.inspections_domaine_enum NOT NULL,
    site character varying NOT NULL,
    statut public.inspections_statut_enum DEFAULT 'EN_COURS'::public.inspections_statut_enum NOT NULL,
    "datePrevue" timestamp without time zone NOT NULL,
    "dateRealise" timestamp without time zone,
    latitude double precision,
    longitude double precision,
    "timestamp" timestamp without time zone DEFAULT now() NOT NULL,
    "auditeurId" uuid NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "planId" uuid,
    "closedById" uuid,
    "closedAt" timestamp without time zone,
    "durationMinutes" integer,
    score double precision,
    "itemsAnswered" integer,
    "itemsTotal" integer,
    "anomaliesCount" integer DEFAULT 0
);


ALTER TABLE public.inspections OWNER TO postgres;

--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "destinataireId" uuid NOT NULL,
    type public.notifications_type_enum NOT NULL,
    titre character varying NOT NULL,
    message character varying,
    lien character varying,
    lu boolean DEFAULT false NOT NULL,
    "luAt" timestamp without time zone,
    "entityId" character varying,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: plan_surveillance; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.plan_surveillance (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    semaine integer NOT NULL,
    annee integer NOT NULL,
    domaine public.plan_surveillance_domaine_enum NOT NULL,
    frequence public.plan_surveillance_frequence_enum NOT NULL,
    statut public.plan_surveillance_statut_enum DEFAULT 'PLANIFIE'::public.plan_surveillance_statut_enum NOT NULL,
    site character varying,
    "dateDebut" date NOT NULL,
    "dateFin" date NOT NULL,
    "inspectionId" character varying,
    "responsableId" uuid,
    commentaire text,
    "autoGenere" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.plan_surveillance OWNER TO postgres;

--
-- Name: regulatory_events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.regulatory_events (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    type public.regulatory_events_type_enum NOT NULL,
    titre character varying(255) NOT NULL,
    description text,
    "datePrevue" timestamp without time zone NOT NULL,
    "dateRealisation" timestamp without time zone,
    statut public.regulatory_events_statut_enum DEFAULT 'PLANIFIE'::public.regulatory_events_statut_enum NOT NULL,
    recurrence character varying(100) DEFAULT 'AUCUNE'::character varying NOT NULL,
    responsable_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.regulatory_events OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "firstName" character varying NOT NULL,
    "lastName" character varying NOT NULL,
    email character varying NOT NULL,
    password character varying,
    role public.users_role_enum DEFAULT 'AUDITEUR'::public.users_role_enum NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "resetPasswordToken" character varying,
    "resetPasswordExpires" timestamp without time zone,
    status public.users_status_enum DEFAULT 'PENDING'::public.users_status_enum NOT NULL,
    "setPasswordToken" character varying,
    "setPasswordExpires" timestamp without time zone,
    department public.users_department_enum
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: action_comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.action_comments (id, "actionId", "authorId", message, mentions, "createdAt", action_id, author_id) FROM stdin;
6688e195-abee-4810-98ea-3087cd44c470	e2d3d6cf-3a1e-4b6e-92aa-8be840686eb4	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	Pièce commandée		2026-07-10 12:16:00.057003	\N	\N
52f3c213-d428-4985-a03d-23a3926e4ccd	e2d3d6cf-3a1e-4b6e-92aa-8be840686eb4	6f4e9c9e-5c7a-4676-8acb-8ff7f03664de	....		2026-07-10 12:17:16.236793	\N	\N
4a417e3d-8897-467e-86d1-bb437a13f404	e2d3d6cf-3a1e-4b6e-92aa-8be840686eb4	6f4e9c9e-5c7a-4676-8acb-8ff7f03664de	aaa		2026-07-10 12:17:38.296579	\N	\N
ece601e5-d0c8-439a-b579-144af4127e7b	ebbe6b9c-7142-4fb9-8f94-2b5c6c4cea1a	bdd9c427-20ec-4456-bc3d-91c23859a150	aaa		2026-07-14 09:16:59.952572	\N	\N
d83ccaa6-8482-41bc-81d5-9101a7205040	ebbe6b9c-7142-4fb9-8f94-2b5c6c4cea1a	bdd9c427-20ec-4456-bc3d-91c23859a150	aaa		2026-07-15 09:44:41.44299	\N	\N
93275c2d-2342-4cd2-8d3b-71801bef28bf	ebbe6b9c-7142-4fb9-8f94-2b5c6c4cea1a	bdd9c427-20ec-4456-bc3d-91c23859a150	aaa		2026-07-15 09:44:48.446294	\N	\N
\.


--
-- Data for Name: action_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.action_history (id, "actionId", "fromStatut", "toStatut", motif, "changedById", "createdAt", action_id) FROM stdin;
9cfb11b2-d375-4cb0-ab34-106342918de4	678ae167-3790-4835-9bf4-dc465a880ba6	TERMINEE	EN_COURS	aaaaaa	bdd9c427-20ec-4456-bc3d-91c23859a150	2026-07-14 09:28:04.238139	\N
\.


--
-- Data for Name: action_proofs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.action_proofs (id, "actionId", type, filename, "originalName", url, mimetype, size, "uploadedById", "uploadedAt", action_id, uploaded_by_id) FROM stdin;
ad56a24d-e90b-4a3a-a061-2b435c5f15bc	ebbe6b9c-7142-4fb9-8f94-2b5c6c4cea1a	DOCUMENT	1784020683596-21908916.pdf	inscription.pdf	/uploads/proofs/1784020683596-21908916.pdf	application/pdf	343592	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	2026-07-14 09:18:03.319196	ebbe6b9c-7142-4fb9-8f94-2b5c6c4cea1a	\N
\.


--
-- Data for Name: anomalies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.anomalies (id, "inspectionId", description, criticite, statut, "createdById", domaine, site, "createdAt", "updatedAt", checklist_item_id) FROM stdin;
6fe6dec3-ae66-4eb2-b00b-79c386bd9dd7	87e79e77-8da0-4dd4-8326-d73ac69defb8	Ventilation en panne, odeurs persistantes constatées	CRITIQUE	OUVERTE	bdd9c427-20ec-4456-bc3d-91c23859a150	Cantine	Menzel Hayet	2026-06-30 09:39:22.014953	2026-06-30 09:39:22.014953	5abeb0ca-d7d8-41aa-9a9e-731b14b4c3cb
81333236-5ef5-43b2-b73d-24f667c2624f	87e79e77-8da0-4dd4-8326-d73ac69defb8	rrrrr	FAIBLE	ACTION_CREEE	bdd9c427-20ec-4456-bc3d-91c23859a150	Cantine	\N	2026-06-30 13:30:29.998525	2026-07-03 18:24:32.405736	5abeb0ca-d7d8-41aa-9a9e-731b14b4c3cb
240967a0-8498-4122-b7b9-a25d502d8fb9	915fde26-15e6-4f98-a1b5-baffcf2cc2e5	taayy	FAIBLE	ACTION_CREEE	bdd9c427-20ec-4456-bc3d-91c23859a150	Infirmerie	\N	2026-06-30 10:20:46.238529	2026-07-06 11:02:47.703606	0e7d1f3b-664c-42f9-889b-36c570350809
78fee49b-0ee2-43ab-8ab2-2d0692297699	87e79e77-8da0-4dd4-8326-d73ac69defb8	aaaaaaaa	FAIBLE	ACTION_CREEE	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	Cantine	\N	2026-07-07 08:52:42.719685	2026-07-07 08:54:24.334059	32f10a52-358c-421c-937c-92f2a629790f
1b003b68-60ea-4c49-8a62-7856eba05176	87e79e77-8da0-4dd4-8326-d73ac69defb8	aaaaaa	FAIBLE	ACTION_CREEE	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	Cantine	\N	2026-07-06 10:52:02.203461	2026-07-14 08:49:14.824382	5abeb0ca-d7d8-41aa-9a9e-731b14b4c3cb
8396c8ac-c26e-4b06-9b1a-0ada1d02ebb1	87e79e77-8da0-4dd4-8326-d73ac69defb8	bbbbbbb	MODERE	ACTION_CREEE	bdd9c427-20ec-4456-bc3d-91c23859a150	Cantine	\N	2026-07-14 09:11:06.466592	2026-07-14 09:11:35.701348	ad4a8ef2-feba-4acb-8cb3-91142ee4163c
\.


--
-- Data for Name: anomaly_photos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.anomaly_photos (id, filename, url, "originalName", "uploadedAt", anomaly_id) FROM stdin;
29269fdf-f5a5-47dd-ae54-e76a2beb0897	1782814846592-146737002.jpg	/uploads/anomalies/1782814846592-146737002.jpg	OIP.jpg	2026-06-30 10:20:46.305958	240967a0-8498-4122-b7b9-a25d502d8fb9
\.


--
-- Data for Name: checklist_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.checklist_items (id, section, libelle, target, ordre, actif, template_id) FROM stdin;
fb889d69-1212-4e1c-8ed2-0dc05e097519	Hygiène alimentaire	Les aliments sont stockés à bonne température	< 4°C pour le froid	0	t	73e4a140-bd7a-4662-a8d5-7a08deba2638
1cecf570-acbc-4286-b902-910ec54d950b	Hygiène alimentaire	Les surfaces de travail sont propres et désinfectées	Nettoyage journalier	1	t	73e4a140-bd7a-4662-a8d5-7a08deba2638
58731404-33e9-462f-819c-ae9d1af71045	Personnel	Le personnel porte les EPI requis	Tablier, gants, charlotte	2	t	73e4a140-bd7a-4662-a8d5-7a08deba2638
5210093b-5ed0-4242-8ca6-446d2826cd7b	Personnel	Le personnel est formé HACCP	Formation < 3 ans	3	t	73e4a140-bd7a-4662-a8d5-7a08deba2638
34f092b4-1d39-418c-ad84-aa797d6807d6	Hygiène alimentaire	Les aliments sont stockés à bonne température	< 4°C pour le froid	0	t	768cf09a-aa69-46c4-b420-f992750e308b
716080cb-7d34-49e3-bafe-b8141e753682	Hygiène alimentaire	Les surfaces de travail sont propres et désinfectées	Nettoyage journalier	1	t	768cf09a-aa69-46c4-b420-f992750e308b
a58662c7-9bce-43d4-a101-b9c9b0cdadad	Personnel	Le personnel porte les EPI requis	Tablier, gants, charlotte	2	t	768cf09a-aa69-46c4-b420-f992750e308b
1d43cda9-4c71-4b90-90f6-fd0eff6c72c8	Personnel	Le personnel est formé HACCP	Formation < 3 ans	3	t	768cf09a-aa69-46c4-b420-f992750e308b
5abeb0ca-d7d8-41aa-9a9e-731b14b4c3cb	Général	Respect de la marche en avant : Conception et séparation des secteurs		0	t	c09a937c-318d-4428-a43d-c97badad9e7e
5992cab4-0192-4f96-b13a-5c7ad4313478	Général	Aération naturelle et /ou artificielle suffisante avec hotte d'extraction		1	t	c09a937c-318d-4428-a43d-c97badad9e7e
39410c64-e680-4fdd-be2b-ed015116806d	Général	Présence de bac à graisse		2	t	c09a937c-318d-4428-a43d-c97badad9e7e
d0697549-524a-4bcf-9dc6-e7247178f13b	Général	Eclairage suffisant		3	t	c09a937c-318d-4428-a43d-c97badad9e7e
ac878c0f-0c3b-42cf-9aab-eaf43194af82	Général	Matériel propre , bien entretenu et destiné à être en contact avec les aliments		4	t	c09a937c-318d-4428-a43d-c97badad9e7e
ad4a8ef2-feba-4acb-8cb3-91142ee4163c	Général	Laverie vaisselle et batterie existantes bien entretenues et munie d'eau chaude		5	t	c09a937c-318d-4428-a43d-c97badad9e7e
32f10a52-358c-421c-937c-92f2a629790f	Général	Installations électriques		6	t	c09a937c-318d-4428-a43d-c97badad9e7e
c4036617-d83f-475b-948f-2714dd012c4b	Général	Installations anti incendie		7	t	c09a937c-318d-4428-a43d-c97badad9e7e
f4678f3b-90aa-4c12-b304-6a4d6ac8e475	Général	Installation d'eaux et absence de fuites		8	t	c09a937c-318d-4428-a43d-c97badad9e7e
e75ed4f2-aa4c-4f33-aefb-5df92bba6c9c	Général	Etat de santé / Visite médicale		9	t	c09a937c-318d-4428-a43d-c97badad9e7e
47231326-8609-427c-8916-62e610a6174b	Général	Analyses corpo/ parasitologiques des selles réalisés (permet de rechercher la présence de bactéries dans les selles.)		10	t	c09a937c-318d-4428-a43d-c97badad9e7e
b656cf74-0d65-49a2-b20f-1f4ee98a3581	Général	Hygiène vestimentaire, corporelle et comportementale		11	t	c09a937c-318d-4428-a43d-c97badad9e7e
e556e844-0498-4e3d-8675-75dbbda3e17d	Général	présence de plat témoin		12	t	c09a937c-318d-4428-a43d-c97badad9e7e
7069af5c-e1c5-4558-a479-6611d0c79296	Général	lavage des légumes		13	t	c09a937c-318d-4428-a43d-c97badad9e7e
6681a6df-7416-45a8-b185-e4e45b3ca1e0	Général	Décongélation des viandes, volailles, poissons		14	t	c09a937c-318d-4428-a43d-c97badad9e7e
96b60e2d-4ac1-43a4-87ab-d9dd881331f6	Général	Qualités des huiles de friteuses		15	t	c09a937c-318d-4428-a43d-c97badad9e7e
cd54f330-3080-46be-bafa-527724b7fdb1	Général	Endroits d'expositions (ensoleillé, humide, poussières)		16	t	c09a937c-318d-4428-a43d-c97badad9e7e
66807f16-2fda-4dcb-8d02-6c3ffa357111	Général	Etat d'expositions (préservé, protection contre les insectes, moustiquaires)		17	t	c09a937c-318d-4428-a43d-c97badad9e7e
8c9b9426-009c-454b-96f6-9c421b58c555	Général	Présence des aliments à hautes risques bien conditionnés (mayonnaise, thon)		18	t	c09a937c-318d-4428-a43d-c97badad9e7e
d7b48517-38ec-47ad-85c6-9d22f415ba4c	Général	Plan de nettoyage et de désinfection		19	t	c09a937c-318d-4428-a43d-c97badad9e7e
2def3911-73a7-464c-bd0f-f9e3a7d89c36	Général	Propreté des locaux et matériel		20	t	c09a937c-318d-4428-a43d-c97badad9e7e
ee9a6529-5006-45d0-b31e-26ae3b3c49e1	Général	Méthode de  lavage des vaiselles		21	t	c09a937c-318d-4428-a43d-c97badad9e7e
71f12def-cb72-4d4f-ae72-855a1b9f8934	Général	Gestion des eaux usées		22	t	c09a937c-318d-4428-a43d-c97badad9e7e
4015af75-dc5d-4919-85ba-a65532132071	Général	Présences des poubelles munies de sacs en plastique et avec couvercles en nombre suffisant dans chaque compartiments		23	t	c09a937c-318d-4428-a43d-c97badad9e7e
c8118a42-343b-4a0e-893d-1cdd6abc47b5	Général	Evacuation journalière des déchets		24	t	c09a937c-318d-4428-a43d-c97badad9e7e
d15501f2-4700-4960-8f39-15d57c53ccf1	Général	Présence d'un programme de lutte contre les nuisibles (les insectes, et les oiseaux) et son application		25	t	c09a937c-318d-4428-a43d-c97badad9e7e
a4e2d9bc-382b-4d98-b491-052f1632f3b2	Général	Présence d'un programme lutte contre les ravageurs (rat, souris, insecte, etc) et son application		26	t	c09a937c-318d-4428-a43d-c97badad9e7e
b805a13c-d359-4b50-95ac-4d56a91c36f4	Général	Respect des règles et conditions de stockage		27	t	c09a937c-318d-4428-a43d-c97badad9e7e
fe193c02-cc2a-4d34-98b2-9aed2faa49c3	Général	Respect des DLC : (Date limite de consommation)		28	t	c09a937c-318d-4428-a43d-c97badad9e7e
0b8f9f28-50a2-4d6d-9ebf-a97a02ca8809	Général	Respect étiquetage et emballage		29	t	c09a937c-318d-4428-a43d-c97badad9e7e
a4aa6874-9f6a-4289-ba4d-7ea3b99b8603	Général	Etat de conservation des aliments, Présence des moisissures (champignon microscopique )		30	t	c09a937c-318d-4428-a43d-c97badad9e7e
7af67df2-ebf2-4a07-9182-3912d878f7b8	Général	Affichage des régles d'hygiène à respecter		31	t	c09a937c-318d-4428-a43d-c97badad9e7e
46d3e496-b07b-4d35-8430-86b6c446a69e	Général	Nombre de secouriste ( minimum 1/ poste)		32	t	c09a937c-318d-4428-a43d-c97badad9e7e
dabbd37a-b00a-4dff-930f-f90b4fe5b6f1	1-Hygiène, sécurité et environnement médical	Sol, surfaces et matériel désinfectés quotidiennement		0	t	6e3d12a0-9864-4e61-b158-93107bcdd855
f0058095-a9dd-40b3-b992-238b9f0a1f49	1-Hygiène, sécurité et environnement médical	Port des EPI (blouse, gants, surchaussures) respecté		1	t	6e3d12a0-9864-4e61-b158-93107bcdd855
3b5adec1-77b8-4b8e-a846-50c727f27a55	1-Hygiène, sécurité et environnement médical	Gestion correcte des déchets médicaux		2	t	6e3d12a0-9864-4e61-b158-93107bcdd855
035df4a8-79fa-40c3-8e37-a85a1361ec0f	1-Hygiène, sécurité et environnement médical	Vérification du sac d'urgence		3	t	6e3d12a0-9864-4e61-b158-93107bcdd855
fccb604a-6ba8-492d-b5c8-1f06e7f150ac	2-Gestion du stock et des médicaments	Inventaire à jour et signé		4	t	6e3d12a0-9864-4e61-b158-93107bcdd855
9ee3b44e-a809-4786-b417-c22b86c92cbb	2-Gestion du stock et des médicaments	Stock de secours disponible		5	t	6e3d12a0-9864-4e61-b158-93107bcdd855
4acf7c85-e91e-4db8-a4fa-232e0aca900a	2-Gestion du stock et des médicaments	Aucun médicament périmé		6	t	6e3d12a0-9864-4e61-b158-93107bcdd855
8cde8d23-a51a-43f5-9dce-f8298c753fb1	2-Gestion du stock et des médicaments	Historique de distribution bien tenu		7	t	6e3d12a0-9864-4e61-b158-93107bcdd855
5a0fae97-c29c-4012-92c0-99af857e3af7	2-Gestion du stock et des médicaments	Étiquetage et rangement conformes		8	t	6e3d12a0-9864-4e61-b158-93107bcdd855
265256e5-d520-4876-9343-c30306e3d538	3-Suivi médical et traçabilité	Fichier des soins à jour		9	t	6e3d12a0-9864-4e61-b158-93107bcdd855
53ceba59-4532-4512-9f03-cbe769002d36	3-Suivi médical et traçabilité	Fichier des bons à lacharge à jour		10	t	6e3d12a0-9864-4e61-b158-93107bcdd855
4395cae5-6415-42ef-8117-3a77a481748f	3-Suivi médical et traçabilité	Fichier des accidents à jour		11	t	6e3d12a0-9864-4e61-b158-93107bcdd855
d4d8f3ac-6b32-4d57-ba25-6e22c20cb35a	3-Suivi médical et traçabilité	Fichier des maladies à jour		12	t	6e3d12a0-9864-4e61-b158-93107bcdd855
c4052b00-b30b-403a-abb4-f4be893c7383	3-Suivi médical et traçabilité	Fichier de suivi des chauffeurs à jour		13	t	6e3d12a0-9864-4e61-b158-93107bcdd855
0810325c-0a61-476d-92fe-fa1f6906e641	3-Suivi médical et traçabilité	Confidentialité respectée (armoire fermée)		14	t	6e3d12a0-9864-4e61-b158-93107bcdd855
680119c2-3eb5-4c9f-ab9b-74e60b714031	3-Suivi médical et traçabilité	Vérification de fluidité des emails avec RH, service pointage  et ,,,		15	t	6e3d12a0-9864-4e61-b158-93107bcdd855
e19a0a80-1ea5-4a88-b2c1-14f4f5209b79	3-Suivi médical et traçabilité	S’assurer que les dossiers sont correctement tenus, classés, et archivés conformément aux règles de confidentialité et de traçabilité.		16	t	6e3d12a0-9864-4e61-b158-93107bcdd855
5f3b068f-22d9-4c1f-be00-5a199fc96c6a	4-Conformité et amélioration continue	Conformité aux normes médicales internes (note de service) : exemple d’interdiction d’effectuer des injections		17	t	6e3d12a0-9864-4e61-b158-93107bcdd855
b65bd466-a68d-494b-82f5-9d505e05b21e	4-Conformité et amélioration continue	Vérification du matériel médical		18	t	6e3d12a0-9864-4e61-b158-93107bcdd855
100ed319-1d32-47d9-8109-6485d9bee833	4-Conformité et amélioration continue	Affichage des indicateurs de performance suivis (nombres de soins, AT, alertes, bon à la charge , MP...)		19	t	6e3d12a0-9864-4e61-b158-93107bcdd855
1376f96e-5351-4902-9426-27994777b0c3	4-Conformité et amélioration continue	Communication des KPIs au service HSEE		20	t	6e3d12a0-9864-4e61-b158-93107bcdd855
987e8766-19c5-4c11-a9e8-ffa732ef92bb	5-Collaboration avec les médecins et les autres services	Observation / réclamation du médecin du travail transmise à l’infirmerie		21	t	6e3d12a0-9864-4e61-b158-93107bcdd855
8fcb7795-beb2-41ac-961a-696c64657b96	5-Collaboration avec les médecins et les autres services	Observation / réclamation du médecin traitant transmise à l’infirmerie		22	t	6e3d12a0-9864-4e61-b158-93107bcdd855
41f1f5b8-a026-45f4-9da1-24dab79cee68	5-Collaboration avec les médecins et les autres services	Observation / réclamation du médecin concernant une contre-visite, transmise à l’infirmerie		23	t	6e3d12a0-9864-4e61-b158-93107bcdd855
dee7dec8-8d2d-4ff0-893a-93fa00164064	5-Collaboration avec les médecins et les autres services	Autre observation / réclamation transmise à l’infirmerie		24	t	6e3d12a0-9864-4e61-b158-93107bcdd855
eaf80527-0aff-43ee-b11d-e379c3c6d0b7	Points à vérifier	Etat de propreté générale(sol, murs, plafond, miroir…)		0	t	9a01a704-56b0-4c46-904b-ff1a1f0cca53
ef3a9956-5f36-4fea-a2fb-f5f7625abd24	Points à vérifier	Est-ce que l'éclairage est existant et  suffisant(éclairage général et éclairage des cabines)?		1	t	9a01a704-56b0-4c46-904b-ff1a1f0cca53
5e536be3-cd61-4763-9d4a-5e17f20c60e8	Points à vérifier	Est-ce que le système d'aération est existant, fonctionnel et efficace?		2	t	9a01a704-56b0-4c46-904b-ff1a1f0cca53
9038b048-2201-4619-ae43-9c37bd86869c	Points à vérifier	Existence du savon et papiers		3	t	9a01a704-56b0-4c46-904b-ff1a1f0cca53
492077c9-51d8-4fbf-9d1d-f0c875bbec12	Points à vérifier	Est -ce que les robinets et les lavabos sont en bon état?		4	t	9a01a704-56b0-4c46-904b-ff1a1f0cca53
8e394a98-059a-4aa4-9045-fa6d798cc5f7	Points à vérifier	Etat des portes et des fenêtres(état général, fermeture,,,,)		5	t	9a01a704-56b0-4c46-904b-ff1a1f0cca53
6373cd3a-1215-45ce-9f91-07df4ff35b52	Points à vérifier	Etat des flexibles et des robinets des toilettes		6	t	9a01a704-56b0-4c46-904b-ff1a1f0cca53
48e28328-dcd7-43e3-977b-f9834e2ee0c6	Points à vérifier	Etat des cuves et des chasses d'eau (état général, calcaire, fuite d'eau…)		7	t	9a01a704-56b0-4c46-904b-ff1a1f0cca53
7582535c-b44d-4aa1-98a3-9d46958c4882	Points à vérifier	Le système d'évacuation d'eau est fonctionnel(siphons, conduite d'eau usée, canalisation des lavabos…)		8	t	9a01a704-56b0-4c46-904b-ff1a1f0cca53
59bd31d0-eedd-4742-9146-942ea5e70f11	Points à vérifier	Etat de propreté générale(sol, murs, plafond, miroir…)		0	t	51feaee3-fd8b-475a-9f9f-4a7c10a32d33
a955d5e8-76f1-47f8-a870-4db75c940a89	Points à vérifier	Est-ce que l'éclairage est existant et  suffisant(éclairage général et éclairage des cabines)?		1	t	51feaee3-fd8b-475a-9f9f-4a7c10a32d33
9996aa50-9088-4bea-a23d-d093954dd003	Points à vérifier	Est-ce que le système d'aération est existant, fonctionnel et efficace?		2	t	51feaee3-fd8b-475a-9f9f-4a7c10a32d33
a9f29578-fc18-4d6d-b1bb-771ec56ec772	Points à vérifier	Existence du savon et papiers		3	t	51feaee3-fd8b-475a-9f9f-4a7c10a32d33
c00e52ab-0d6d-4f7b-837f-010229c2f6a6	Points à vérifier	Est -ce que les robinets et les lavabos sont en bon état?		4	t	51feaee3-fd8b-475a-9f9f-4a7c10a32d33
ac8a23bb-2afe-473f-8d7d-429c45ade066	Points à vérifier	Etat des portes et des fenêtres(état général, fermeture,,,,)		5	t	51feaee3-fd8b-475a-9f9f-4a7c10a32d33
5e6d3177-83b7-41d9-bffa-f448709d46d6	Points à vérifier	Etat des flexibles et des robinets des toilettes		6	t	51feaee3-fd8b-475a-9f9f-4a7c10a32d33
b3aa0e13-a806-4b99-9f73-24544f06d508	Points à vérifier	Etat des cuves et des chasses d'eau (état général, calcaire, fuite d'eau…)		7	t	51feaee3-fd8b-475a-9f9f-4a7c10a32d33
7fc87784-da48-4cfe-b376-79ef9853c979	Points à vérifier	Le système d'évacuation d'eau est fonctionnel(siphons, conduite d'eau usée, canalisation des lavabos…)		8	t	51feaee3-fd8b-475a-9f9f-4a7c10a32d33
1c2a6b7d-00c5-4e1f-901a-9fa03732b901	1-Hygiène, sécurité et environnement médical	Sol, surfaces et matériel désinfectés quotidiennement		0	t	e29eda67-c41e-4aab-ba9e-050f4a9110d7
b6c19c41-e485-473f-9c02-0d4b050c933b	1-Hygiène, sécurité et environnement médical	Port des EPI (blouse, gants, surchaussures) respecté		1	t	e29eda67-c41e-4aab-ba9e-050f4a9110d7
847ba3b3-6a7b-4983-b45c-3df7e9ca44aa	1-Hygiène, sécurité et environnement médical	Gestion correcte des déchets médicaux		2	t	e29eda67-c41e-4aab-ba9e-050f4a9110d7
2bd36750-cdaa-4964-9b8a-132894f5ffae	1-Hygiène, sécurité et environnement médical	Vérification du sac d'urgence		3	t	e29eda67-c41e-4aab-ba9e-050f4a9110d7
de1a5443-0e77-41d7-be2b-3f6a0961d514	2-Gestion du stock et des médicaments	Inventaire à jour et signé		4	t	e29eda67-c41e-4aab-ba9e-050f4a9110d7
f7b45aef-e642-4c58-bc06-223c7b826f42	2-Gestion du stock et des médicaments	Stock de secours disponible		5	t	e29eda67-c41e-4aab-ba9e-050f4a9110d7
2313cbeb-f637-4cf8-b134-3901201ba24f	2-Gestion du stock et des médicaments	Aucun médicament périmé		6	t	e29eda67-c41e-4aab-ba9e-050f4a9110d7
40f9d500-1db6-4abc-aff9-9b4696949157	2-Gestion du stock et des médicaments	Historique de distribution bien tenu		7	t	e29eda67-c41e-4aab-ba9e-050f4a9110d7
d81e2c70-e84d-4ea9-9590-0a674092822d	2-Gestion du stock et des médicaments	Étiquetage et rangement conformes		8	t	e29eda67-c41e-4aab-ba9e-050f4a9110d7
a2fbd6ea-8b9c-403f-955a-85623c6ef78e	3-Suivi médical et traçabilité	Fichier des soins à jour		9	t	e29eda67-c41e-4aab-ba9e-050f4a9110d7
61c36111-83c9-4c34-8f4c-d0dab445fbb2	3-Suivi médical et traçabilité	Fichier des bons à lacharge à jour		10	t	e29eda67-c41e-4aab-ba9e-050f4a9110d7
eb672510-2c97-4169-9768-7a88744b93d2	3-Suivi médical et traçabilité	Fichier des accidents à jour		11	t	e29eda67-c41e-4aab-ba9e-050f4a9110d7
b2c92466-c577-4727-b6db-84ccabc3e17e	3-Suivi médical et traçabilité	Fichier des maladies à jour		12	t	e29eda67-c41e-4aab-ba9e-050f4a9110d7
24eba2d1-dd7f-4083-8278-c908ddef2967	3-Suivi médical et traçabilité	Fichier de suivi des chauffeurs à jour		13	t	e29eda67-c41e-4aab-ba9e-050f4a9110d7
ff8910e3-5ad9-47a7-9e0b-97e335247c9f	3-Suivi médical et traçabilité	Confidentialité respectée (armoire fermée)		14	t	e29eda67-c41e-4aab-ba9e-050f4a9110d7
302eda88-17ce-4220-afdc-81bd2421734b	3-Suivi médical et traçabilité	Vérification de fluidité des emails avec RH, service pointage  et ,,,		15	t	e29eda67-c41e-4aab-ba9e-050f4a9110d7
8f23ba23-3296-431f-8dc4-151fe61f6571	3-Suivi médical et traçabilité	S’assurer que les dossiers sont correctement tenus, classés, et archivés conformément aux règles de confidentialité et de traçabilité.		16	t	e29eda67-c41e-4aab-ba9e-050f4a9110d7
979826f8-45d3-43b3-958d-e807dd1c9c4f	4-Conformité et amélioration continue	Conformité aux normes médicales internes (note de service) : exemple d’interdiction d’effectuer des injections		17	t	e29eda67-c41e-4aab-ba9e-050f4a9110d7
33a0b32f-b3ed-4c12-9650-cf29021e8ba6	4-Conformité et amélioration continue	Vérification du matériel médical		18	t	e29eda67-c41e-4aab-ba9e-050f4a9110d7
0557e427-38f0-4589-b4fd-5920b16a6098	4-Conformité et amélioration continue	Affichage des indicateurs de performance suivis (nombres de soins, AT, alertes, bon à la charge , MP...)		19	t	e29eda67-c41e-4aab-ba9e-050f4a9110d7
626f6525-b05f-4efc-beae-27ba2a02af7c	4-Conformité et amélioration continue	Communication des KPIs au service HSEE		20	t	e29eda67-c41e-4aab-ba9e-050f4a9110d7
92f7edf8-fe02-4a93-824a-3eddc6239943	5-Collaboration avec les médecins et les autres services	Observation / réclamation du médecin du travail transmise à l’infirmerie		21	t	e29eda67-c41e-4aab-ba9e-050f4a9110d7
729c2f88-2824-4b2d-9657-8608e02d1896	5-Collaboration avec les médecins et les autres services	Observation / réclamation du médecin traitant transmise à l’infirmerie		22	t	e29eda67-c41e-4aab-ba9e-050f4a9110d7
427111f2-7904-4cfc-b14c-3b8cce9dde19	5-Collaboration avec les médecins et les autres services	Observation / réclamation du médecin concernant une contre-visite, transmise à l’infirmerie		23	t	e29eda67-c41e-4aab-ba9e-050f4a9110d7
aa325044-8478-44d8-a0c3-4156624c90d7	5-Collaboration avec les médecins et les autres services	Autre observation / réclamation transmise à l’infirmerie		24	t	e29eda67-c41e-4aab-ba9e-050f4a9110d7
33b8b36a-3570-4bfc-9482-aa5a39e1bc33	1-Hygiène, sécurité et environnement médical	Sol, surfaces et matériel désinfectés quotidiennement		0	t	5af75b80-51ad-4081-af74-f8416022fa6d
0e7d1f3b-664c-42f9-889b-36c570350809	1-Hygiène, sécurité et environnement médical	Port des EPI (blouse, gants, surchaussures) respecté		1	t	5af75b80-51ad-4081-af74-f8416022fa6d
fc9ed1f1-a3a6-412d-b214-524139c8cefb	1-Hygiène, sécurité et environnement médical	Gestion correcte des déchets médicaux		2	t	5af75b80-51ad-4081-af74-f8416022fa6d
986d497e-f682-4d50-bab5-fce42ec72f2e	1-Hygiène, sécurité et environnement médical	Vérification du sac d'urgence		3	t	5af75b80-51ad-4081-af74-f8416022fa6d
e191ade2-86f4-40b8-8835-73935d58d772	2-Gestion du stock et des médicaments	Inventaire à jour et signé		4	t	5af75b80-51ad-4081-af74-f8416022fa6d
ab8ed607-fc5d-4d69-86c7-3d3955a90546	2-Gestion du stock et des médicaments	Stock de secours disponible		5	t	5af75b80-51ad-4081-af74-f8416022fa6d
4f8c0593-f190-45de-b4ee-9e2d1b8c439e	2-Gestion du stock et des médicaments	Aucun médicament périmé		6	t	5af75b80-51ad-4081-af74-f8416022fa6d
22bbf464-26e8-4669-8fe9-ee7f0757bf46	2-Gestion du stock et des médicaments	Historique de distribution bien tenu		7	t	5af75b80-51ad-4081-af74-f8416022fa6d
d80abb49-5034-4436-898d-846431f1593c	2-Gestion du stock et des médicaments	Étiquetage et rangement conformes		8	t	5af75b80-51ad-4081-af74-f8416022fa6d
6910592e-dad0-4523-adbb-74eb9b90b56f	3-Suivi médical et traçabilité	Fichier des soins à jour		9	t	5af75b80-51ad-4081-af74-f8416022fa6d
20507f21-d059-40c3-9341-694b217c1f13	3-Suivi médical et traçabilité	Fichier des bons à lacharge à jour		10	t	5af75b80-51ad-4081-af74-f8416022fa6d
ffb6465d-4e42-4be4-be6b-3f3d75787f9f	3-Suivi médical et traçabilité	Fichier des accidents à jour		11	t	5af75b80-51ad-4081-af74-f8416022fa6d
27d44ece-4e62-471b-adb9-65eb5b117f05	3-Suivi médical et traçabilité	Fichier des maladies à jour		12	t	5af75b80-51ad-4081-af74-f8416022fa6d
b3a90818-337d-4805-90cb-6761fd34706e	3-Suivi médical et traçabilité	Fichier de suivi des chauffeurs à jour		13	t	5af75b80-51ad-4081-af74-f8416022fa6d
ebaf44de-4130-4416-a80f-20ad6a18a8b1	3-Suivi médical et traçabilité	Confidentialité respectée (armoire fermée)		14	t	5af75b80-51ad-4081-af74-f8416022fa6d
831eb579-6af9-4d31-a69d-e5c4c04648fe	3-Suivi médical et traçabilité	Vérification de fluidité des emails avec RH, service pointage  et ,,,		15	t	5af75b80-51ad-4081-af74-f8416022fa6d
962bc4eb-de09-49b0-8197-61599f544cbf	3-Suivi médical et traçabilité	S’assurer que les dossiers sont correctement tenus, classés, et archivés conformément aux règles de confidentialité et de traçabilité.		16	t	5af75b80-51ad-4081-af74-f8416022fa6d
789a9ffc-a135-42c5-a8fe-96a6e1c234ed	4-Conformité et amélioration continue	Conformité aux normes médicales internes (note de service) : exemple d’interdiction d’effectuer des injections		17	t	5af75b80-51ad-4081-af74-f8416022fa6d
b2f731a3-c152-4ccf-848e-ee7246779f04	4-Conformité et amélioration continue	Vérification du matériel médical		18	t	5af75b80-51ad-4081-af74-f8416022fa6d
d4af548e-d131-4e02-b1cf-2d1a825ddaa6	4-Conformité et amélioration continue	Affichage des indicateurs de performance suivis (nombres de soins, AT, alertes, bon à la charge , MP...)		19	t	5af75b80-51ad-4081-af74-f8416022fa6d
988b58d9-a9cc-4583-8d61-c7a674f4a91f	4-Conformité et amélioration continue	Communication des KPIs au service HSEE		20	t	5af75b80-51ad-4081-af74-f8416022fa6d
ced0a4a2-083e-48e5-a14e-8103a7471249	5-Collaboration avec les médecins et les autres services	Observation / réclamation du médecin du travail transmise à l’infirmerie		21	t	5af75b80-51ad-4081-af74-f8416022fa6d
26b35e3b-4aa9-42a2-88e7-c5b3efc02231	5-Collaboration avec les médecins et les autres services	Observation / réclamation du médecin traitant transmise à l’infirmerie		22	t	5af75b80-51ad-4081-af74-f8416022fa6d
7e2f2cc0-611d-4eb7-b960-734e79f5bd8b	5-Collaboration avec les médecins et les autres services	Observation / réclamation du médecin concernant une contre-visite, transmise à l’infirmerie		23	t	5af75b80-51ad-4081-af74-f8416022fa6d
3a5b1b50-24c5-40b0-834b-d30ca28b1bbb	5-Collaboration avec les médecins et les autres services	Autre observation / réclamation transmise à l’infirmerie		24	t	5af75b80-51ad-4081-af74-f8416022fa6d
\.


--
-- Data for Name: checklist_response_photos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.checklist_response_photos (id, filename, url, "originalName", "uploadedAt", response_id) FROM stdin;
c88283ff-50cf-4e0b-a72f-34476fbeda62	1782376566960-367392136.jpg	/uploads/checklists/1782376566960-367392136.jpg	images.jpg	2026-06-25 08:36:06.999683	b58874ae-3c85-4eee-a9de-260be586c404
\.


--
-- Data for Name: checklist_responses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.checklist_responses (id, "inspectionId", cotation, observation, "analyseCauses", responsable, delai, "isDeviation", "createdAt", item_id) FROM stdin;
24ec31e4-dc0d-4ef4-9c00-714ea3143e8b	87e79e77-8da0-4dd4-8326-d73ac69defb8	0	Ventilation en panne	Panne moteur ventilateur	Chef maintenance	2026-07-01	t	2026-06-25 08:33:59.819291	5992cab4-0192-4f96-b13a-5c7ad4313478
8bd6cace-0203-407f-b615-de78d0b5ee56	87e79e77-8da0-4dd4-8326-d73ac69defb8	NA	\N	\N	\N	\N	f	2026-06-25 09:03:29.733452	d0697549-524a-4bcf-9dc6-e7247178f13b
a9182610-a55d-478a-a46f-cd963d864a5e	87e79e77-8da0-4dd4-8326-d73ac69defb8	2	\N	\N	\N	\N	f	2026-06-25 09:03:32.4439	ac878c0f-0c3b-42cf-9aab-eaf43194af82
26c93173-6311-4b9b-aedc-b7a5cad8661f	87e79e77-8da0-4dd4-8326-d73ac69defb8	2	\N	\N	\N	\N	f	2026-06-25 09:03:35.510822	ee9a6529-5006-45d0-b31e-26ae3b3c49e1
739b0a25-7cc6-4336-a8f2-b689bf64de10	87e79e77-8da0-4dd4-8326-d73ac69defb8	2	\N	\N	\N	\N	f	2026-06-25 09:03:37.978947	46d3e496-b07b-4d35-8430-86b6c446a69e
07385a72-fc83-4b7c-a334-8f886e688991	87e79e77-8da0-4dd4-8326-d73ac69defb8	2	\N	\N	\N	\N	f	2026-06-25 09:03:43.671199	7af67df2-ebf2-4a07-9182-3912d878f7b8
499acaf7-9ff1-4217-a0ee-b837912da1a8	87e79e77-8da0-4dd4-8326-d73ac69defb8	2	\N	\N	\N	\N	f	2026-06-25 09:03:45.759587	0b8f9f28-50a2-4d6d-9ebf-a97a02ca8809
9f5e785e-8202-41ae-b1ba-e357be99ee62	87e79e77-8da0-4dd4-8326-d73ac69defb8	2	\N	\N	\N	\N	f	2026-06-25 09:03:47.828153	fe193c02-cc2a-4d34-98b2-9aed2faa49c3
38ceef46-70eb-46b8-87ea-5e30056376ac	87e79e77-8da0-4dd4-8326-d73ac69defb8	1	\N	\N	\N	\N	f	2026-06-25 09:03:49.772694	a4e2d9bc-382b-4d98-b491-052f1632f3b2
a7c5423f-c318-4537-8e48-72bad187ddcc	87e79e77-8da0-4dd4-8326-d73ac69defb8	1	\N	\N	\N	\N	f	2026-06-25 09:04:31.02828	71f12def-cb72-4d4f-ae72-855a1b9f8934
a4e8ddc0-aad3-49fb-80fc-6c236b9e67be	87e79e77-8da0-4dd4-8326-d73ac69defb8	2	\N	\N	\N	\N	f	2026-06-25 09:03:26.314964	39410c64-e680-4fdd-be2b-ed015116806d
5745b25d-62ec-436d-9283-bf292d09d274	87e79e77-8da0-4dd4-8326-d73ac69defb8	NA	\N	\N	\N	\N	f	2026-06-29 08:10:19.381937	ad4a8ef2-feba-4acb-8cb3-91142ee4163c
fb0ecb9e-88db-417a-a105-80e1585005c1	87e79e77-8da0-4dd4-8326-d73ac69defb8	1	\N	\N	\N	\N	f	2026-06-29 08:10:20.21268	32f10a52-358c-421c-937c-92f2a629790f
0d909fd5-c19a-4226-80c3-e431e5331f83	87e79e77-8da0-4dd4-8326-d73ac69defb8	NA	\N	\N	\N	\N	f	2026-06-29 08:10:23.098702	f4678f3b-90aa-4c12-b304-6a4d6ac8e475
27e146ea-dc80-4352-9ab5-85dc0367b18b	87e79e77-8da0-4dd4-8326-d73ac69defb8	2	\N	\N	\N	\N	f	2026-06-29 08:10:24.046476	e75ed4f2-aa4c-4f33-aefb-5df92bba6c9c
1928690a-81a7-4da7-963f-87950bc037c1	87e79e77-8da0-4dd4-8326-d73ac69defb8	1	\N	\N	\N	\N	f	2026-06-29 08:10:25.612213	47231326-8609-427c-8916-62e610a6174b
5c44215d-491b-412f-8bb2-bdc776143241	87e79e77-8da0-4dd4-8326-d73ac69defb8	2	\N	\N	\N	\N	f	2026-06-29 08:10:26.280927	b656cf74-0d65-49a2-b20f-1f4ee98a3581
f3f1c442-6088-468e-8ff7-75648016f609	87e79e77-8da0-4dd4-8326-d73ac69defb8	NA	\N	\N	\N	\N	f	2026-06-29 08:10:27.595912	e556e844-0498-4e3d-8675-75dbbda3e17d
ef8d3e35-aaa1-47ae-a3a4-ef178f609e1f	87e79e77-8da0-4dd4-8326-d73ac69defb8	2	\N	\N	\N	\N	f	2026-06-29 08:10:28.35075	7069af5c-e1c5-4558-a479-6611d0c79296
c2b01fb2-0286-424f-a6f9-132d27bf0c3e	87e79e77-8da0-4dd4-8326-d73ac69defb8	2	\N	\N	\N	\N	f	2026-06-29 08:10:35.751555	cd54f330-3080-46be-bafa-527724b7fdb1
0f2770a0-4ac6-409c-a8cf-570a77d25470	87e79e77-8da0-4dd4-8326-d73ac69defb8	2	\N	\N	\N	\N	f	2026-06-29 08:10:36.543482	66807f16-2fda-4dcb-8d02-6c3ffa357111
a7da081b-d47d-4767-a503-916534ba7e2e	87e79e77-8da0-4dd4-8326-d73ac69defb8	2	\N	\N	\N	\N	f	2026-06-29 08:10:38.185568	8c9b9426-009c-454b-96f6-9c421b58c555
d1919ff6-bae8-455c-9843-6c511edcc51c	87e79e77-8da0-4dd4-8326-d73ac69defb8	2	\N	\N	\N	\N	f	2026-06-29 08:10:38.849706	d7b48517-38ec-47ad-85c6-9d22f415ba4c
151e15de-fae6-4c34-9e81-3a64db24174a	87e79e77-8da0-4dd4-8326-d73ac69defb8	1	\N	\N	\N	\N	f	2026-06-29 08:10:40.600504	2def3911-73a7-464c-bd0f-f9e3a7d89c36
717d8e98-c39a-4629-a6d2-d70d240950c5	87e79e77-8da0-4dd4-8326-d73ac69defb8	2	\N	\N	\N	\N	f	2026-06-29 08:10:42.91562	4015af75-dc5d-4919-85ba-a65532132071
196aad6b-b864-4466-909d-214a6c8290c9	87e79e77-8da0-4dd4-8326-d73ac69defb8	2	\N	\N	\N	\N	f	2026-06-29 08:10:43.788618	c8118a42-343b-4a0e-893d-1cdd6abc47b5
2ba4c847-4348-4b8e-8253-e4f722a85878	87e79e77-8da0-4dd4-8326-d73ac69defb8	2	\N	\N	\N	\N	f	2026-06-29 08:10:45.301718	d15501f2-4700-4960-8f39-15d57c53ccf1
c3e5d87f-4b40-4ca3-a8eb-dfa969f18db3	87e79e77-8da0-4dd4-8326-d73ac69defb8	2	\N	\N	\N	\N	f	2026-06-29 08:10:46.599091	b805a13c-d359-4b50-95ac-4d56a91c36f4
43d69e0f-6cd4-43dd-a4e0-54cd1cd332e0	87e79e77-8da0-4dd4-8326-d73ac69defb8	2	\N	\N	\N	\N	f	2026-06-29 08:10:48.363108	a4aa6874-9f6a-4289-ba4d-7ea3b99b8603
0b372f60-ab35-41c7-b6cc-5e552c1cf8cc	915fde26-15e6-4f98-a1b5-baffcf2cc2e5	1	\N	\N	\N	\N	f	2026-06-29 08:30:28.58826	1c2a6b7d-00c5-4e1f-901a-9fa03732b901
13ff16bc-1948-4b10-82df-d5088116846b	915fde26-15e6-4f98-a1b5-baffcf2cc2e5	1	\N	\N	\N	\N	f	2026-06-29 08:34:44.790027	b6c19c41-e485-473f-9c02-0d4b050c933b
ac8c09a9-0222-413c-afd5-2e8f13350a4d	915fde26-15e6-4f98-a1b5-baffcf2cc2e5	2	\N	\N	\N	\N	f	2026-06-29 08:34:46.035765	847ba3b3-6a7b-4983-b45c-3df7e9ca44aa
80bb94ad-f61d-43a4-88ae-6fbffaa23701	915fde26-15e6-4f98-a1b5-baffcf2cc2e5	0	\N	\N	\N	\N	t	2026-06-29 08:34:47.576956	2bd36750-cdaa-4964-9b8a-132894f5ffae
782de369-dcc2-4bdf-b731-691b6e42c960	915fde26-15e6-4f98-a1b5-baffcf2cc2e5	0	\N	\N	\N	\N	t	2026-06-29 08:35:37.598953	de1a5443-0e77-41d7-be2b-3f6a0961d514
5ec2821e-a2c4-42fb-bd66-6c43f351ea27	915fde26-15e6-4f98-a1b5-baffcf2cc2e5	2	\N	\N	\N	\N	f	2026-06-29 08:35:38.98192	f7b45aef-e642-4c58-bc06-223c7b826f42
9bda4b9a-c695-4f39-b59c-46b2f53a96a9	915fde26-15e6-4f98-a1b5-baffcf2cc2e5	2	\N	\N	\N	\N	f	2026-06-29 08:35:40.407744	2313cbeb-f637-4cf8-b134-3901201ba24f
167ea8b9-329a-4fd1-9c25-a025d00cde86	915fde26-15e6-4f98-a1b5-baffcf2cc2e5	2	\N	\N	\N	\N	f	2026-06-29 08:35:41.637472	40f9d500-1db6-4abc-aff9-9b4696949157
88e830b6-354a-465b-9504-205e2ee3b6bc	915fde26-15e6-4f98-a1b5-baffcf2cc2e5	2	\N	\N	\N	\N	f	2026-06-29 08:35:42.477205	d81e2c70-e84d-4ea9-9590-0a674092822d
91b6a9e3-3ccb-4217-91f9-698283f212ef	915fde26-15e6-4f98-a1b5-baffcf2cc2e5	2	\N	\N	\N	\N	f	2026-06-29 08:35:44.836659	b2c92466-c577-4727-b6db-84ccabc3e17e
469a336e-e352-4a97-96fc-eeb495d3b566	915fde26-15e6-4f98-a1b5-baffcf2cc2e5	2	\N	\N	\N	\N	f	2026-06-29 08:35:45.559559	24eba2d1-dd7f-4083-8278-c908ddef2967
e47b966e-3041-4fd9-8dff-446db1dbab3c	915fde26-15e6-4f98-a1b5-baffcf2cc2e5	2	\N	\N	\N	\N	f	2026-06-29 08:35:46.198096	ff8910e3-5ad9-47a7-9e0b-97e335247c9f
039a3577-096d-4a05-b145-a6bf95a03a9b	915fde26-15e6-4f98-a1b5-baffcf2cc2e5	2	\N	\N	\N	\N	f	2026-06-29 08:35:47.390623	302eda88-17ce-4220-afdc-81bd2421734b
f48b5fb8-cff2-4da4-9087-3c30ba06f871	915fde26-15e6-4f98-a1b5-baffcf2cc2e5	2	\N	\N	\N	\N	f	2026-06-29 08:35:48.508683	8f23ba23-3296-431f-8dc4-151fe61f6571
71569c46-63e9-4aae-904e-64d61616a4f9	915fde26-15e6-4f98-a1b5-baffcf2cc2e5	2	\N	\N	\N	\N	f	2026-06-29 08:35:50.854952	979826f8-45d3-43b3-958d-e807dd1c9c4f
be95aaf5-35e3-4c36-8a38-7f80c8e81085	915fde26-15e6-4f98-a1b5-baffcf2cc2e5	2	\N	\N	\N	\N	f	2026-06-29 08:35:51.589754	33a0b32f-b3ed-4c12-9650-cf29021e8ba6
7eb2db4e-dcf1-4455-9867-a13f0bbdea9a	915fde26-15e6-4f98-a1b5-baffcf2cc2e5	2	\N	\N	\N	\N	f	2026-06-29 08:35:53.185591	0557e427-38f0-4589-b4fd-5920b16a6098
8edaa6ed-927e-455b-96d2-7ef542935b93	915fde26-15e6-4f98-a1b5-baffcf2cc2e5	2	\N	\N	\N	\N	f	2026-06-29 08:35:53.825478	626f6525-b05f-4efc-beae-27ba2a02af7c
12c76bc5-4208-45de-a4c1-46642fbbabf7	915fde26-15e6-4f98-a1b5-baffcf2cc2e5	2	\N	\N	\N	\N	f	2026-06-29 08:35:57.910445	92f7edf8-fe02-4a93-824a-3eddc6239943
040818df-a5f6-46a4-a494-55a17c1fbb0b	915fde26-15e6-4f98-a1b5-baffcf2cc2e5	2	\N	\N	\N	\N	f	2026-06-29 08:35:58.683091	729c2f88-2824-4b2d-9657-8608e02d1896
f8e67288-fe60-4c3c-9df7-217e3e3f4eb6	915fde26-15e6-4f98-a1b5-baffcf2cc2e5	2	\N	\N	\N	\N	f	2026-06-29 08:35:59.589482	427111f2-7904-4cfc-b14c-3b8cce9dde19
2e9407cb-ae0e-4996-92ca-b9661cb687f4	915fde26-15e6-4f98-a1b5-baffcf2cc2e5	2	\N	\N	\N	\N	f	2026-06-29 08:36:00.643104	aa325044-8478-44d8-a0c3-4156624c90d7
b58874ae-3c85-4eee-a9de-260be586c404	87e79e77-8da0-4dd4-8326-d73ac69defb8	1	Conforme	\N	\N	\N	f	2026-06-25 08:32:51.680546	5abeb0ca-d7d8-41aa-9a9e-731b14b4c3cb
c177b15e-5304-4d21-b4cd-5feec44f161a	87e79e77-8da0-4dd4-8326-d73ac69defb8	NA	\N	\N	\N	\N	f	2026-06-29 08:10:21.787313	c4036617-d83f-475b-948f-2714dd012c4b
b831bc39-ddcd-4133-a9b3-b84cc29ec19d	87e79e77-8da0-4dd4-8326-d73ac69defb8	2	\N	\N	\N	\N	f	2026-06-29 08:10:29.393112	6681a6df-7416-45a8-b185-e4e45b3ca1e0
b3aadfad-acb4-4cf1-9bb1-f113edf8cb28	87e79e77-8da0-4dd4-8326-d73ac69defb8	2	\N	\N	\N	\N	f	2026-06-29 08:10:33.630935	96b60e2d-4ac1-43a4-87ab-d9dd881331f6
aea73a70-4182-45f5-adc9-03cb9e1204ec	12c8b97d-f9b8-4ebd-a00c-e4c357017e26	2	\N	\N	\N	\N	f	2026-07-20 09:25:41.49226	5abeb0ca-d7d8-41aa-9a9e-731b14b4c3cb
a59653c1-9815-4ead-b097-acd2734bedc9	12c8b97d-f9b8-4ebd-a00c-e4c357017e26	1	\N	\N	\N	\N	f	2026-07-20 09:25:43.715178	5992cab4-0192-4f96-b13a-5c7ad4313478
d1e58d69-8036-4145-9ba8-f25538d08497	12c8b97d-f9b8-4ebd-a00c-e4c357017e26	2	\N	\N	\N	\N	f	2026-07-20 09:25:45.020244	39410c64-e680-4fdd-be2b-ed015116806d
0da402fb-5119-4fd0-84de-8042087d1208	12c8b97d-f9b8-4ebd-a00c-e4c357017e26	2	\N	\N	\N	\N	f	2026-07-20 09:25:46.209159	d0697549-524a-4bcf-9dc6-e7247178f13b
550ac2a7-8a86-46a7-b6eb-d930ec0de176	12c8b97d-f9b8-4ebd-a00c-e4c357017e26	2	\N	\N	\N	\N	f	2026-07-20 09:25:47.448925	ac878c0f-0c3b-42cf-9aab-eaf43194af82
7105e2a7-8e9d-4946-bc87-481ad58f2d0f	12c8b97d-f9b8-4ebd-a00c-e4c357017e26	2	\N	\N	\N	\N	f	2026-07-20 09:25:49.31995	ad4a8ef2-feba-4acb-8cb3-91142ee4163c
2b13e5aa-9284-488a-8392-328ad987748d	12c8b97d-f9b8-4ebd-a00c-e4c357017e26	2	\N	\N	\N	\N	f	2026-07-20 09:25:50.407417	32f10a52-358c-421c-937c-92f2a629790f
8b071d8e-8dd0-404d-ba7a-dd2ab15a4983	12c8b97d-f9b8-4ebd-a00c-e4c357017e26	2	\N	\N	\N	\N	f	2026-07-20 09:25:51.519855	c4036617-d83f-475b-948f-2714dd012c4b
ae9bf5ee-a364-4273-a88e-d82fb63a693c	12c8b97d-f9b8-4ebd-a00c-e4c357017e26	2	\N	\N	\N	\N	f	2026-07-20 09:25:52.546064	f4678f3b-90aa-4c12-b304-6a4d6ac8e475
61b9cd41-7936-47c9-859e-c10ad6c05b5f	12c8b97d-f9b8-4ebd-a00c-e4c357017e26	1	\N	\N	\N	\N	f	2026-07-20 09:25:54.131307	e75ed4f2-aa4c-4f33-aefb-5df92bba6c9c
6b7f3d07-dc21-4a9b-838c-7a3599a6f8f2	12c8b97d-f9b8-4ebd-a00c-e4c357017e26	1	\N	\N	\N	\N	f	2026-07-20 09:25:55.637702	47231326-8609-427c-8916-62e610a6174b
e6c6ef12-e773-48c5-b345-026efb164285	12c8b97d-f9b8-4ebd-a00c-e4c357017e26	2	\N	\N	\N	\N	f	2026-07-20 09:25:58.192226	46d3e496-b07b-4d35-8430-86b6c446a69e
d3484c1f-1099-467a-80dd-d72543cb3394	12c8b97d-f9b8-4ebd-a00c-e4c357017e26	2	\N	\N	\N	\N	f	2026-07-20 09:25:59.011398	7af67df2-ebf2-4a07-9182-3912d878f7b8
c8dbf78e-e567-4285-8ef7-12ea2ca16777	12c8b97d-f9b8-4ebd-a00c-e4c357017e26	1	\N	\N	\N	\N	f	2026-07-20 09:25:59.980993	a4aa6874-9f6a-4289-ba4d-7ea3b99b8603
1fd0a2c5-b59a-493e-adbc-30694f811fdb	12c8b97d-f9b8-4ebd-a00c-e4c357017e26	1	\N	\N	\N	\N	f	2026-07-20 09:26:01.926211	0b8f9f28-50a2-4d6d-9ebf-a97a02ca8809
0c65fe57-d3c8-41be-b584-845466e08390	12c8b97d-f9b8-4ebd-a00c-e4c357017e26	2	\N	\N	\N	\N	f	2026-07-20 09:26:02.695585	fe193c02-cc2a-4d34-98b2-9aed2faa49c3
47b5b04a-6acb-4b00-bc19-1799507b8413	12c8b97d-f9b8-4ebd-a00c-e4c357017e26	2	\N	\N	\N	\N	f	2026-07-20 09:26:04.2031	b805a13c-d359-4b50-95ac-4d56a91c36f4
caf0802a-6748-49e7-9f69-16ac8eee5d52	12c8b97d-f9b8-4ebd-a00c-e4c357017e26	2	\N	\N	\N	\N	f	2026-07-20 09:26:04.836723	a4e2d9bc-382b-4d98-b491-052f1632f3b2
65edf47b-76a5-4aa4-83eb-a5eb27d70300	12c8b97d-f9b8-4ebd-a00c-e4c357017e26	2	\N	\N	\N	\N	f	2026-07-20 09:26:06.119834	d15501f2-4700-4960-8f39-15d57c53ccf1
57912545-2bd2-46d6-8362-f226d790eab5	12c8b97d-f9b8-4ebd-a00c-e4c357017e26	2	\N	\N	\N	\N	f	2026-07-20 09:26:06.751174	c8118a42-343b-4a0e-893d-1cdd6abc47b5
7bd58dad-4211-46df-ba0c-ee05cfe8fd5d	12c8b97d-f9b8-4ebd-a00c-e4c357017e26	NA	\N	\N	\N	\N	f	2026-07-20 09:26:07.758274	4015af75-dc5d-4919-85ba-a65532132071
c9cee281-190a-424c-b6a0-abc8cec73118	12c8b97d-f9b8-4ebd-a00c-e4c357017e26	2	\N	\N	\N	\N	f	2026-07-20 09:26:09.79139	71f12def-cb72-4d4f-ae72-855a1b9f8934
54063531-3956-42b5-b15b-07590d14ae03	12c8b97d-f9b8-4ebd-a00c-e4c357017e26	NA	\N	\N	\N	\N	f	2026-07-20 09:26:11.206755	ee9a6529-5006-45d0-b31e-26ae3b3c49e1
c1e94ca4-de22-4c6a-a4cc-ca667b03cb69	12c8b97d-f9b8-4ebd-a00c-e4c357017e26	2	\N	\N	\N	\N	f	2026-07-20 09:26:12.492459	2def3911-73a7-464c-bd0f-f9e3a7d89c36
d1e6daaf-b854-4f46-9bdc-0675bdf7f7e9	12c8b97d-f9b8-4ebd-a00c-e4c357017e26	2	\N	\N	\N	\N	f	2026-07-20 09:26:13.552711	d7b48517-38ec-47ad-85c6-9d22f415ba4c
b7a44d93-30c7-46b6-b804-a40ca3682fd1	12c8b97d-f9b8-4ebd-a00c-e4c357017e26	2	\N	\N	\N	\N	f	2026-07-20 09:26:14.224956	8c9b9426-009c-454b-96f6-9c421b58c555
fa547892-848d-41f7-9f03-8665d6c21baa	12c8b97d-f9b8-4ebd-a00c-e4c357017e26	2	\N	\N	\N	\N	f	2026-07-20 09:26:15.24063	66807f16-2fda-4dcb-8d02-6c3ffa357111
db6de6d7-3233-477b-a08f-1ee2216f0e24	12c8b97d-f9b8-4ebd-a00c-e4c357017e26	2	\N	\N	\N	\N	f	2026-07-20 09:26:16.181054	cd54f330-3080-46be-bafa-527724b7fdb1
4be896a9-8301-48cd-a6dc-7bca18187fb6	12c8b97d-f9b8-4ebd-a00c-e4c357017e26	2	\N	\N	\N	\N	f	2026-07-20 09:26:17.723256	96b60e2d-4ac1-43a4-87ab-d9dd881331f6
4456c7aa-e0c3-4061-9649-bdb1ff43b425	12c8b97d-f9b8-4ebd-a00c-e4c357017e26	2	\N	\N	\N	\N	f	2026-07-20 09:26:18.641773	6681a6df-7416-45a8-b185-e4e45b3ca1e0
ef58dd7c-699a-4ded-b1c9-21d651bfa223	12c8b97d-f9b8-4ebd-a00c-e4c357017e26	2	\N	\N	\N	\N	f	2026-07-20 09:26:20.418413	7069af5c-e1c5-4558-a479-6611d0c79296
628f1fb0-5a37-43d0-bf1b-60bd08c69b49	12c8b97d-f9b8-4ebd-a00c-e4c357017e26	2	\N	\N	\N	\N	f	2026-07-20 09:26:21.606047	e556e844-0498-4e3d-8675-75dbbda3e17d
0614172c-bc5b-4430-b2a1-469a484e9f5c	12c8b97d-f9b8-4ebd-a00c-e4c357017e26	2	\N	\N	\N	\N	f	2026-07-20 09:26:22.826874	b656cf74-0d65-49a2-b20f-1f4ee98a3581
\.


--
-- Data for Name: checklist_templates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.checklist_templates (id, domaine, titre, version, "cotationType", actif, "createdAt", "updatedAt") FROM stdin;
768cf09a-aa69-46c4-b420-f992750e308b	Cantine	Checklist Surveillance Cantine	2	0_1_2_NA	f	2026-06-22 09:01:45.871215	2026-06-22 09:08:26.208341
e0bf2ada-a7c3-4412-9530-431f20ef174c	Cantine	Checklist Cantine Import	3	0_1_2_NA	f	2026-06-22 09:08:26.216422	2026-06-22 09:17:06.99655
c09a937c-318d-4428-a43d-c97badad9e7e	Cantine	Checklist Cantine Import	4	0_1_2_NA	t	2026-06-22 09:17:07.003695	2026-06-22 09:17:07.003695
73e4a140-bd7a-4662-a8d5-7a08deba2638	Cantine	Checklist Surveillance Cantine	1	0_1_2_NA	f	2026-06-22 08:58:55.099562	2026-06-23 10:15:32.148723
9a01a704-56b0-4c46-904b-ff1a1f0cca53	Sanitaires	sanitaire	1	0_4_6_8_10	f	2026-06-23 10:34:21.143107	2026-06-23 11:18:05.193974
51feaee3-fd8b-475a-9f9f-4a7c10a32d33	Sanitaires	S	2	0_4_6_8_10	t	2026-06-23 11:18:05.212336	2026-06-23 11:18:05.212336
6e3d12a0-9864-4e61-b158-93107bcdd855	Infirmerie	Checklist Surveillance infirmerie	1	0_1_2_NA	f	2026-06-23 10:34:01.994269	2026-06-29 08:29:54.493442
e29eda67-c41e-4aab-ba9e-050f4a9110d7	Infirmerie	checklist infirmerie	2	0_1_2	f	2026-06-29 08:29:54.503397	2026-06-29 10:16:40.365848
5af75b80-51ad-4081-af74-f8416022fa6d	Infirmerie	nteb	3	0_1_2	t	2026-06-29 10:16:40.380097	2026-06-29 10:16:40.380097
\.


--
-- Data for Name: corrective_actions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.corrective_actions (id, "anomalyId", description, criticite, deadline, "criteresValidation", statut, "motifRejet", progression, "piloteId", "createdById", "closedById", "closedAt", domaine, site, "createdAt", "updatedAt", anomaly_id) FROM stdin;
e2d3d6cf-3a1e-4b6e-92aa-8be840686eb4	78fee49b-0ee2-43ab-8ab2-2d0692297699	zzzzzzzz	FAIBLE	2026-08-09	eeeee	VALIDEE	\N	100	6f4e9c9e-5c7a-4676-8acb-8ff7f03664de	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	\N	\N	Cantine	\N	2026-07-07 08:54:24.328173	2026-07-09 12:20:59.961018	78fee49b-0ee2-43ab-8ab2-2d0692297699
76cd1c17-407d-4d4d-986f-1583ccab3330	81333236-5ef5-43b2-b73d-24f667c2624f	remplacer le filtre ...	FAIBLE	2026-07-05	débit > 500	REJETEE	\N	100	6f4e9c9e-5c7a-4676-8acb-8ff7f03664de	bdd9c427-20ec-4456-bc3d-91c23859a150	\N	\N	Cantine	\N	2026-07-03 18:24:32.350484	2026-07-09 12:21:16.196902	81333236-5ef5-43b2-b73d-24f667c2624f
ce2c15cb-4852-47ed-959f-a28fc6d6f637	1b003b68-60ea-4c49-8a62-7856eba05176	aaaaaaaaaaaa	FAIBLE	2026-08-15	aaaaaaaaaaaaaa	A_FAIRE	\N	0	6f4e9c9e-5c7a-4676-8acb-8ff7f03664de	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	\N	\N	Cantine	\N	2026-07-14 08:49:14.818311	2026-07-14 08:49:14.818311	1b003b68-60ea-4c49-8a62-7856eba05176
678ae167-3790-4835-9bf4-dc465a880ba6	240967a0-8498-4122-b7b9-a25d502d8fb9	aaaaaaa	MODERE	2026-08-08	aaaaa	EN_COURS	aaaaaa	90	6f4e9c9e-5c7a-4676-8acb-8ff7f03664de	bdd9c427-20ec-4456-bc3d-91c23859a150	\N	\N	Infirmerie	\N	2026-07-06 11:02:47.680292	2026-07-14 09:28:04.230059	240967a0-8498-4122-b7b9-a25d502d8fb9
ebbe6b9c-7142-4fb9-8f94-2b5c6c4cea1a	8396c8ac-c26e-4b06-9b1a-0ada1d02ebb1	cccccccc	MODERE	2026-10-05	dddddddd	TERMINEE	\N	100	6f4e9c9e-5c7a-4676-8acb-8ff7f03664de	bdd9c427-20ec-4456-bc3d-91c23859a150	\N	\N	Cantine	\N	2026-07-14 09:11:35.693691	2026-07-16 08:06:09.241656	8396c8ac-c26e-4b06-9b1a-0ada1d02ebb1
\.


--
-- Data for Name: inspections; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inspections (id, domaine, site, statut, "datePrevue", "dateRealise", latitude, longitude, "timestamp", "auditeurId", "createdAt", "updatedAt", "planId", "closedById", "closedAt", "durationMinutes", score, "itemsAnswered", "itemsTotal", "anomaliesCount") FROM stdin;
915fde26-15e6-4f98-a1b5-baffcf2cc2e5	Infirmerie	Sousse	EN_COURS	2026-07-06 01:00:00	\N	\N	\N	2026-06-29 09:27:31.706	bdd9c427-20ec-4456-bc3d-91c23859a150	2026-06-29 08:27:31.443532	2026-06-29 08:27:31.443532	\N	\N	\N	\N	\N	\N	\N	0
12c8b97d-f9b8-4ebd-a00c-e4c357017e26	Cantine	Sousse	EN_COURS	2026-07-31 01:00:00	\N	\N	\N	2026-06-29 10:25:52.775	bdd9c427-20ec-4456-bc3d-91c23859a150	2026-06-29 09:25:52.830436	2026-06-29 09:25:52.830436	\N	\N	\N	\N	\N	\N	\N	0
391289c8-3969-41c9-8301-53cc59870dfe	Cantine	Sousse	EN_COURS	2026-07-20 01:00:00	\N	\N	\N	2026-07-20 10:21:19.637	bdd9c427-20ec-4456-bc3d-91c23859a150	2026-07-20 09:21:19.143323	2026-07-20 09:21:19.143323	f25fdf69-55ca-4997-8475-9abd1de913c9	\N	\N	\N	\N	\N	\N	0
87e79e77-8da0-4dd4-8326-d73ac69defb8	Cantine	Menzel Hayet	REALISE	2026-06-25 09:00:00	2026-07-20 10:37:13.654	\N	\N	2026-06-25 09:29:39.683	bdd9c427-20ec-4456-bc3d-91c23859a150	2026-06-25 08:29:39.707025	2026-07-20 09:37:13.300391	\N	bdd9c427-20ec-4456-bc3d-91c23859a150	2026-07-20 10:37:13.654	36068	\N	\N	\N	0
0ada7529-9504-43b4-bfe7-a23095d6ddda	Cantine	Sousse	EN_COURS	2026-07-20 01:00:00	\N	\N	\N	2026-07-20 10:38:08.384	bdd9c427-20ec-4456-bc3d-91c23859a150	2026-07-20 09:38:07.902677	2026-07-20 09:38:07.902677	67205465-c5f8-4fc5-b05d-6e68edb6db30	\N	\N	\N	\N	\N	\N	0
af0086cb-6371-418c-81da-373d0e460e9c	Cantine	Sousse	EN_COURS	2026-07-19 01:00:00	\N	\N	\N	2026-07-20 10:38:31.984	bdd9c427-20ec-4456-bc3d-91c23859a150	2026-07-20 09:38:32.593267	2026-07-20 09:38:32.593267	\N	\N	\N	\N	\N	\N	\N	0
bc336ab5-fb4c-4e6c-a0d6-1b4736ae282f	Cantine	Sousse	EN_COURS	2026-07-20 01:00:00	\N	\N	\N	2026-07-20 10:39:20.086	bdd9c427-20ec-4456-bc3d-91c23859a150	2026-07-20 09:39:19.421992	2026-07-20 09:39:19.421992	1f50f95c-e498-45fe-bf8c-0724cf002b47	\N	\N	\N	\N	\N	\N	0
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, "destinataireId", type, titre, message, lien, lu, "luAt", "entityId", "createdAt") FROM stdin;
e9169a38-c0db-4bbc-b937-6bb5c5eacfc8	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Infirmerie prévue pour la semaine S27 est en retard.	/mes-taches	f	\N	fef5b0ce-7bec-4d78-8cdb-550ec934e666	2026-07-13 12:11:44.750074
f961b974-5fb4-488f-8bcd-95f06e9fac2e	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Infirmerie (Semaine S27) est en retard.	/mes-taches	f	\N	fef5b0ce-7bec-4d78-8cdb-550ec934e666	2026-07-13 12:11:44.782759
b2c51bbe-2d8e-4048-9a9e-02dca994540a	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S27 est en retard.	/mes-taches	f	\N	10f3ea3c-ac1d-4e6b-95a6-ddd40bcdfaf5	2026-07-13 12:11:44.788578
593c4bfe-150b-446b-937a-4c368a5f6318	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S27) est en retard.	/mes-taches	f	\N	10f3ea3c-ac1d-4e6b-95a6-ddd40bcdfaf5	2026-07-13 12:11:44.792008
aa206ba9-fe16-43bf-83fd-1e3e80e7e304	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S5 est en retard.	/mes-taches	f	\N	67205465-c5f8-4fc5-b05d-6e68edb6db30	2026-07-13 12:11:44.79656
70d788c7-8baf-4e65-8d68-2bea2ac6c14b	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S5) est en retard.	/mes-taches	f	\N	67205465-c5f8-4fc5-b05d-6e68edb6db30	2026-07-13 12:11:44.799811
11845b1a-8703-4426-b1dd-b88003c75b92	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S6 est en retard.	/mes-taches	f	\N	1f50f95c-e498-45fe-bf8c-0724cf002b47	2026-07-13 12:11:44.803201
13cee88f-1941-41df-aea1-80e7fea58d56	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S6) est en retard.	/mes-taches	f	\N	1f50f95c-e498-45fe-bf8c-0724cf002b47	2026-07-13 12:11:44.807057
733c260f-f8bd-46fe-af56-ff7393c7567b	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S7 est en retard.	/mes-taches	f	\N	2ff5ff74-96e8-41e1-a4ee-3b0fbbd37a02	2026-07-13 12:11:44.81122
2de804b4-11ab-4cad-aeca-e80f95261b35	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S7) est en retard.	/mes-taches	f	\N	2ff5ff74-96e8-41e1-a4ee-3b0fbbd37a02	2026-07-13 12:11:44.814988
31a76cf0-cffe-4be5-9792-d38a52811ef9	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S8 est en retard.	/mes-taches	f	\N	27ca5fe5-8373-442d-93ec-5c2ec24a5cd2	2026-07-13 12:11:44.819033
2db9efe0-d846-49c4-b5c7-51b1d2edbef9	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S8) est en retard.	/mes-taches	f	\N	27ca5fe5-8373-442d-93ec-5c2ec24a5cd2	2026-07-13 12:11:44.823208
6c37c874-b2a0-469b-aba9-c99a813936ed	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S9 est en retard.	/mes-taches	f	\N	83263296-9905-41fc-95b0-f491e106ff76	2026-07-13 12:11:44.827265
8fc6ace1-c92c-4069-897d-cbbc22a00e2b	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S9) est en retard.	/mes-taches	f	\N	83263296-9905-41fc-95b0-f491e106ff76	2026-07-13 12:11:44.832197
c4bf35bb-8eaa-4233-b7e3-cbaa26f94a03	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S10 est en retard.	/mes-taches	f	\N	b4b492a8-e265-4e56-8e38-53c62a662387	2026-07-13 12:11:44.835943
5f21c726-fec9-4567-86dc-f082c284c075	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S10) est en retard.	/mes-taches	f	\N	b4b492a8-e265-4e56-8e38-53c62a662387	2026-07-13 12:11:44.841619
d9cb0be9-d7ff-4274-bcd0-32fa53981587	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S11 est en retard.	/mes-taches	f	\N	b6c36a49-a20a-431a-a215-66e800fa008d	2026-07-13 12:11:44.845462
d0047e2b-d3c7-4da5-9ffa-48beb52d33e2	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S11) est en retard.	/mes-taches	f	\N	b6c36a49-a20a-431a-a215-66e800fa008d	2026-07-13 12:11:44.848496
ea26e6c1-7c67-4a7a-a548-143525324193	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S12 est en retard.	/mes-taches	f	\N	715dd598-4606-4144-89e0-95e37e200cb4	2026-07-13 12:11:44.854332
7e843c51-5052-4c05-ab5e-a7d195f938ab	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S12) est en retard.	/mes-taches	f	\N	715dd598-4606-4144-89e0-95e37e200cb4	2026-07-13 12:11:44.859374
f13bcd1b-cf2e-459d-a23c-5e987e683757	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S13 est en retard.	/mes-taches	f	\N	aace607e-a533-4e7a-b028-0979a9048e24	2026-07-13 12:11:44.863069
18ca8c0c-6f07-4ec8-82a8-ce4795ed817c	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S13) est en retard.	/mes-taches	f	\N	aace607e-a533-4e7a-b028-0979a9048e24	2026-07-13 12:11:44.866447
e450e2c8-7d6a-496b-a8d4-cb89c8260379	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S28 est en retard.	/mes-taches	f	\N	05102cd2-6fd8-4012-9bcb-37f4f0493ec2	2026-07-13 12:11:44.871057
cc8e419f-9608-4d69-a336-083ef3a9fb7a	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S28) est en retard.	/mes-taches	f	\N	05102cd2-6fd8-4012-9bcb-37f4f0493ec2	2026-07-13 12:11:44.874172
2905fb20-8c33-43dd-9cbf-65ce4267c7cd	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S14 est en retard.	/mes-taches	f	\N	79df8789-64d5-4ae6-86d5-a8db931280e5	2026-07-13 12:11:44.877102
fe627834-6f3e-40a5-9b0a-5897a05762e5	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S14) est en retard.	/mes-taches	f	\N	79df8789-64d5-4ae6-86d5-a8db931280e5	2026-07-13 12:11:44.881128
3f66e95c-4542-45be-8892-95b35cccc5b8	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S15 est en retard.	/mes-taches	f	\N	02630876-54e9-4d05-9650-63ce89037779	2026-07-13 12:11:44.884245
91910afe-206e-43fe-b986-605564c1b1df	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S15) est en retard.	/mes-taches	f	\N	02630876-54e9-4d05-9650-63ce89037779	2026-07-13 12:11:44.890009
77ad3fe2-2def-40d9-9559-994d25bfd373	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S16 est en retard.	/mes-taches	f	\N	80fab3c2-020d-4fd4-88c2-fabd36676055	2026-07-13 12:11:44.892861
b128db20-ccff-43a6-8196-adcbf8eedf8a	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S16) est en retard.	/mes-taches	f	\N	80fab3c2-020d-4fd4-88c2-fabd36676055	2026-07-13 12:11:44.897062
31ff47cc-cc5f-4527-9526-e917fc2a8fdc	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S17 est en retard.	/mes-taches	f	\N	581038bd-54ab-4048-81d9-753997345154	2026-07-13 12:11:44.899959
fd3e6711-937d-42ab-80a6-0411dbf48420	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S17) est en retard.	/mes-taches	f	\N	581038bd-54ab-4048-81d9-753997345154	2026-07-13 12:11:44.902859
61042180-02ca-42f8-a664-4e72ca28a81e	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S18 est en retard.	/mes-taches	f	\N	81dc25ce-bb8a-4193-ad2a-3fbe5e0163db	2026-07-13 12:11:44.90618
75db37a9-90e5-4022-a18d-79130eb3229d	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S18) est en retard.	/mes-taches	f	\N	81dc25ce-bb8a-4193-ad2a-3fbe5e0163db	2026-07-13 12:11:44.90924
b70b4008-4dea-42d1-a9d9-537cafc8f7b3	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S19 est en retard.	/mes-taches	f	\N	c0c66aed-7cdb-4578-80a3-dcc73be9ccd6	2026-07-13 12:11:44.91328
a39aff76-f367-4575-b866-db277a8ac8bd	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S19) est en retard.	/mes-taches	f	\N	c0c66aed-7cdb-4578-80a3-dcc73be9ccd6	2026-07-13 12:11:44.916512
c4cc6fc0-aa0b-451b-b9c8-c99a2197748c	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S20 est en retard.	/mes-taches	f	\N	d8f7380f-2b3e-4a2a-a5a7-af860f1b343c	2026-07-13 12:11:44.920141
5b3b2984-579e-43b2-9dae-8faa646bd264	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S20) est en retard.	/mes-taches	f	\N	d8f7380f-2b3e-4a2a-a5a7-af860f1b343c	2026-07-13 12:11:44.923722
8ca9a298-cb33-4357-b8fb-d16e58e38f17	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S21 est en retard.	/mes-taches	f	\N	aa647e0d-0e5f-4d8a-852b-9afbf0340d1c	2026-07-13 12:11:44.926711
8e1130cc-7400-4668-9773-cbb0d58ab266	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S21) est en retard.	/mes-taches	f	\N	aa647e0d-0e5f-4d8a-852b-9afbf0340d1c	2026-07-13 12:11:44.930537
577b43e8-a20a-44dc-9c69-1903a32f09d2	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S22 est en retard.	/mes-taches	f	\N	4dbf96c0-938b-4f1a-9678-59d693c0e290	2026-07-13 12:11:44.933471
ef178199-1c44-4d62-a433-19f0c62ad517	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S22) est en retard.	/mes-taches	f	\N	4dbf96c0-938b-4f1a-9678-59d693c0e290	2026-07-13 12:11:44.936658
861eeda7-fc8e-48a1-a988-7d2d77d1b445	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S23 est en retard.	/mes-taches	f	\N	197bae46-2951-4796-909c-16a38cf5eb30	2026-07-13 12:11:44.939344
06c96db4-bf25-40b1-8f2b-9c469d595431	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S23) est en retard.	/mes-taches	f	\N	197bae46-2951-4796-909c-16a38cf5eb30	2026-07-13 12:11:44.942081
d263ef51-cf3f-4648-b29b-cb22f5979d73	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S24 est en retard.	/mes-taches	f	\N	f46b584c-5809-420d-9cdd-851b1745135a	2026-07-13 12:11:44.945316
5fb4990d-c872-4a7d-b3f8-a515af601a4b	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S24) est en retard.	/mes-taches	f	\N	f46b584c-5809-420d-9cdd-851b1745135a	2026-07-13 12:11:44.948489
37e5b375-f7f6-4b28-aa1e-c79efb9cecee	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S25 est en retard.	/mes-taches	f	\N	ef2afd20-3330-49b9-8526-2d0c14be549d	2026-07-13 12:11:44.951458
a8789df0-6663-4063-afa8-c7caca729d4c	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S25) est en retard.	/mes-taches	f	\N	ef2afd20-3330-49b9-8526-2d0c14be549d	2026-07-13 12:11:44.954113
ce477375-825b-4079-beb1-a3e2180e00dd	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S26 est en retard.	/mes-taches	f	\N	fa9983da-12ec-498d-b859-0642828844dd	2026-07-13 12:11:44.957317
6f76680c-95af-4511-8881-fb8bcaa64264	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S26) est en retard.	/mes-taches	f	\N	fa9983da-12ec-498d-b859-0642828844dd	2026-07-13 12:11:44.960104
4af4dfea-1660-4286-9ba8-6ffd5d094b09	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Infirmerie prévue pour la semaine S27 est en retard.	/mes-taches	f	\N	fef5b0ce-7bec-4d78-8cdb-550ec934e666	2026-07-14 08:46:44.967124
f2aea975-dac9-4165-8070-55dc5a5a54ca	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Infirmerie (Semaine S27) est en retard.	/mes-taches	f	\N	fef5b0ce-7bec-4d78-8cdb-550ec934e666	2026-07-14 08:46:44.985615
05f98808-7cfd-4993-a6fe-e316dd857c80	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S27 est en retard.	/mes-taches	f	\N	10f3ea3c-ac1d-4e6b-95a6-ddd40bcdfaf5	2026-07-14 08:46:44.988847
735a524d-219e-415a-a99b-16afd3e49e0e	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S27) est en retard.	/mes-taches	f	\N	10f3ea3c-ac1d-4e6b-95a6-ddd40bcdfaf5	2026-07-14 08:46:44.99229
c0606a29-b14e-4201-91b7-9c6a44427b9e	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S5 est en retard.	/mes-taches	f	\N	67205465-c5f8-4fc5-b05d-6e68edb6db30	2026-07-14 08:46:44.995652
4d8f4edc-318c-406f-b3ca-8365370e37cf	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S5) est en retard.	/mes-taches	f	\N	67205465-c5f8-4fc5-b05d-6e68edb6db30	2026-07-14 08:46:44.998734
3398a316-bfd3-4424-9a77-ed49b0757781	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S6 est en retard.	/mes-taches	f	\N	1f50f95c-e498-45fe-bf8c-0724cf002b47	2026-07-14 08:46:45.001781
347d34eb-37b9-41d2-8208-4d688d431ed7	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S6) est en retard.	/mes-taches	f	\N	1f50f95c-e498-45fe-bf8c-0724cf002b47	2026-07-14 08:46:45.004595
679cd28d-7146-4043-81a3-cbfe94572baa	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S7 est en retard.	/mes-taches	f	\N	2ff5ff74-96e8-41e1-a4ee-3b0fbbd37a02	2026-07-14 08:46:45.007694
13d36aa1-599f-4ddc-af8a-93dde583d43d	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S7) est en retard.	/mes-taches	f	\N	2ff5ff74-96e8-41e1-a4ee-3b0fbbd37a02	2026-07-14 08:46:45.010806
046ba6b3-943d-485a-b500-d16a801fc8b1	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S8 est en retard.	/mes-taches	f	\N	27ca5fe5-8373-442d-93ec-5c2ec24a5cd2	2026-07-14 08:46:45.014163
790a7584-5663-48b2-9ed5-b634742a63cb	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S8) est en retard.	/mes-taches	f	\N	27ca5fe5-8373-442d-93ec-5c2ec24a5cd2	2026-07-14 08:46:45.017194
d3a12a76-6d0a-49fa-9343-f5564c6fe832	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S9 est en retard.	/mes-taches	f	\N	83263296-9905-41fc-95b0-f491e106ff76	2026-07-14 08:46:45.020103
6404a2b3-f8db-4488-b7c7-449b8d17b670	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S9) est en retard.	/mes-taches	f	\N	83263296-9905-41fc-95b0-f491e106ff76	2026-07-14 08:46:45.022809
3edeb6aa-a369-4b5d-90d1-7728cc1828f7	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S10 est en retard.	/mes-taches	f	\N	b4b492a8-e265-4e56-8e38-53c62a662387	2026-07-14 08:46:45.025704
ba8ceb54-05ca-4833-a201-887d7be752aa	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S10) est en retard.	/mes-taches	f	\N	b4b492a8-e265-4e56-8e38-53c62a662387	2026-07-14 08:46:45.028456
ba7d9cfb-e477-4b09-a15f-c9df6712b70f	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S11 est en retard.	/mes-taches	f	\N	b6c36a49-a20a-431a-a215-66e800fa008d	2026-07-14 08:46:45.031211
7f0bb325-70b6-442f-85a6-6aaa32eb2d90	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S11) est en retard.	/mes-taches	f	\N	b6c36a49-a20a-431a-a215-66e800fa008d	2026-07-14 08:46:45.034691
e49c2ccf-3402-4128-978f-c1a3fe2e0b6c	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S12 est en retard.	/mes-taches	f	\N	715dd598-4606-4144-89e0-95e37e200cb4	2026-07-14 08:46:45.038233
480e82b2-e83c-4b79-bf3c-696591ee7894	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S12) est en retard.	/mes-taches	f	\N	715dd598-4606-4144-89e0-95e37e200cb4	2026-07-14 08:46:45.041068
0fbd0c8a-9f64-4221-a8f7-43ded38a3db5	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S13 est en retard.	/mes-taches	f	\N	aace607e-a533-4e7a-b028-0979a9048e24	2026-07-14 08:46:45.044154
6b8fadd8-4062-416f-b835-28ca6a9c0f2a	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S13) est en retard.	/mes-taches	f	\N	aace607e-a533-4e7a-b028-0979a9048e24	2026-07-14 08:46:45.047719
2f0cf8cc-fe7c-44ef-aa04-aee71b8f764c	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S28 est en retard.	/mes-taches	f	\N	05102cd2-6fd8-4012-9bcb-37f4f0493ec2	2026-07-14 08:46:45.051029
f3605d80-aaa7-45ae-94e3-3ba031f1c76a	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S28) est en retard.	/mes-taches	f	\N	05102cd2-6fd8-4012-9bcb-37f4f0493ec2	2026-07-14 08:46:45.054606
9f9033ef-e65f-474c-a7dd-29c2e3309ecb	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S14 est en retard.	/mes-taches	f	\N	79df8789-64d5-4ae6-86d5-a8db931280e5	2026-07-14 08:46:45.057579
8f32bcb4-4977-4413-93c2-f70aaaf76aaf	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S14) est en retard.	/mes-taches	f	\N	79df8789-64d5-4ae6-86d5-a8db931280e5	2026-07-14 08:46:45.060141
749c2edb-f0fd-446d-95cb-882f5499299b	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S15 est en retard.	/mes-taches	f	\N	02630876-54e9-4d05-9650-63ce89037779	2026-07-14 08:46:45.062925
b7ed2b30-798e-43c5-b908-5e745e506fb8	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S15) est en retard.	/mes-taches	f	\N	02630876-54e9-4d05-9650-63ce89037779	2026-07-14 08:46:45.065826
30d0dabc-f130-48a6-88e1-b6a7a5770d41	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S16 est en retard.	/mes-taches	f	\N	80fab3c2-020d-4fd4-88c2-fabd36676055	2026-07-14 08:46:45.06841
c67fb4b4-7807-4f36-a816-2703a194b0b7	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S16) est en retard.	/mes-taches	f	\N	80fab3c2-020d-4fd4-88c2-fabd36676055	2026-07-14 08:46:45.071098
b322831e-6bac-4748-8f43-359ae6d449ec	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S17 est en retard.	/mes-taches	f	\N	581038bd-54ab-4048-81d9-753997345154	2026-07-14 08:46:45.073615
ce6fbaf1-f071-48a0-bd3c-7a46a2c61750	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S17) est en retard.	/mes-taches	f	\N	581038bd-54ab-4048-81d9-753997345154	2026-07-14 08:46:45.076327
d351f7aa-0673-47a8-8935-67a7e50d38e0	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S18 est en retard.	/mes-taches	f	\N	81dc25ce-bb8a-4193-ad2a-3fbe5e0163db	2026-07-14 08:46:45.079292
b9b20a7a-b0f0-4815-b447-62cc7de7451b	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S18) est en retard.	/mes-taches	f	\N	81dc25ce-bb8a-4193-ad2a-3fbe5e0163db	2026-07-14 08:46:45.111063
c7eb2198-d50f-4e1d-9607-d18c8a446a4f	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S19 est en retard.	/mes-taches	f	\N	c0c66aed-7cdb-4578-80a3-dcc73be9ccd6	2026-07-14 08:46:45.1147
626eadba-a9e1-49b2-9bad-204da46aa57f	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S19) est en retard.	/mes-taches	f	\N	c0c66aed-7cdb-4578-80a3-dcc73be9ccd6	2026-07-14 08:46:45.117536
ff8d9a22-c683-449b-be6b-0928f2b71cd9	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S20 est en retard.	/mes-taches	f	\N	d8f7380f-2b3e-4a2a-a5a7-af860f1b343c	2026-07-14 08:46:45.120482
0de72959-e3db-4178-99b2-8f6f9d11f184	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S20) est en retard.	/mes-taches	f	\N	d8f7380f-2b3e-4a2a-a5a7-af860f1b343c	2026-07-14 08:46:45.123574
f6fe2d8c-0ef0-4ebc-8f46-077912f222dd	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S21 est en retard.	/mes-taches	f	\N	aa647e0d-0e5f-4d8a-852b-9afbf0340d1c	2026-07-14 08:46:45.126054
2747d88b-e0a0-434b-aae3-377dbb135ccc	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S21) est en retard.	/mes-taches	f	\N	aa647e0d-0e5f-4d8a-852b-9afbf0340d1c	2026-07-14 08:46:45.128529
5559c76b-7ca2-44d3-bb3f-8d68680ac257	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S22 est en retard.	/mes-taches	f	\N	4dbf96c0-938b-4f1a-9678-59d693c0e290	2026-07-14 08:46:45.131497
9a55b6ce-3ed1-4efc-ad0a-b49c2d24030a	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S22) est en retard.	/mes-taches	f	\N	4dbf96c0-938b-4f1a-9678-59d693c0e290	2026-07-14 08:46:45.134747
0b72d995-33d9-4a51-b707-6fcb7d6bc120	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S23 est en retard.	/mes-taches	f	\N	197bae46-2951-4796-909c-16a38cf5eb30	2026-07-14 08:46:45.137518
e7ab26ae-17f0-4f87-9812-df7d3733b49b	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S23) est en retard.	/mes-taches	f	\N	197bae46-2951-4796-909c-16a38cf5eb30	2026-07-14 08:46:45.14022
82522856-060c-40e9-9d4a-0edc96d2fa32	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S24 est en retard.	/mes-taches	f	\N	f46b584c-5809-420d-9cdd-851b1745135a	2026-07-14 08:46:45.143201
adf31175-a7eb-401a-8563-333fffd2e2a7	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S24) est en retard.	/mes-taches	f	\N	f46b584c-5809-420d-9cdd-851b1745135a	2026-07-14 08:46:45.14596
e653d539-6865-477b-b4f7-c8665970eb61	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S25 est en retard.	/mes-taches	f	\N	ef2afd20-3330-49b9-8526-2d0c14be549d	2026-07-14 08:46:45.148685
aa296f6c-31b4-4f8a-b39e-e2385a19169c	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S25) est en retard.	/mes-taches	f	\N	ef2afd20-3330-49b9-8526-2d0c14be549d	2026-07-14 08:46:45.151553
0502f542-b168-4da1-99fb-b40917fcb067	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S26 est en retard.	/mes-taches	f	\N	fa9983da-12ec-498d-b859-0642828844dd	2026-07-14 08:46:45.154395
ccf8fce7-fcd4-4e0c-8a3a-7f22721a88a8	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S26) est en retard.	/mes-taches	f	\N	fa9983da-12ec-498d-b859-0642828844dd	2026-07-14 08:46:45.157512
ac6ce1bf-0061-4f01-b572-058306fe3835	6f4e9c9e-5c7a-4676-8acb-8ff7f03664de	ACTION_ASSIGNEE	⚡ Nouvelle action corrective	Admin HSEE vous a assigné une action : "aaaaaaaaaaaa..."	/actions/ce2c15cb-4852-47ed-959f-a28fc6d6f637	f	\N	ce2c15cb-4852-47ed-959f-a28fc6d6f637	2026-07-14 08:49:14.827401
fca8da1e-4b6e-45ec-8fa5-abca5d736932	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Infirmerie prévue pour la semaine S27 est en retard.	/mes-taches	f	\N	fef5b0ce-7bec-4d78-8cdb-550ec934e666	2026-07-14 09:05:23.8311
68608834-27b2-41f7-a695-36fb58c66506	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Infirmerie (Semaine S27) est en retard.	/mes-taches	f	\N	fef5b0ce-7bec-4d78-8cdb-550ec934e666	2026-07-14 09:05:23.849136
ab6ccd19-2249-4fca-abeb-74b57d26ef3e	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S27 est en retard.	/mes-taches	f	\N	10f3ea3c-ac1d-4e6b-95a6-ddd40bcdfaf5	2026-07-14 09:05:23.854817
2402e327-7041-4a07-8ae1-17121b3d0311	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S27) est en retard.	/mes-taches	f	\N	10f3ea3c-ac1d-4e6b-95a6-ddd40bcdfaf5	2026-07-14 09:05:23.859604
ebeb8ff8-616d-4517-88a0-8a54907f5db4	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S5 est en retard.	/mes-taches	f	\N	67205465-c5f8-4fc5-b05d-6e68edb6db30	2026-07-14 09:05:23.863589
57bc8b56-3a11-401b-826b-9b6077219ff2	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S5) est en retard.	/mes-taches	f	\N	67205465-c5f8-4fc5-b05d-6e68edb6db30	2026-07-14 09:05:23.868064
f490f411-8d02-4045-8799-278cef477983	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S6 est en retard.	/mes-taches	f	\N	1f50f95c-e498-45fe-bf8c-0724cf002b47	2026-07-14 09:05:23.873405
d87f37f0-6dbf-4c79-a99f-5ca396daaaf2	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S6) est en retard.	/mes-taches	f	\N	1f50f95c-e498-45fe-bf8c-0724cf002b47	2026-07-14 09:05:23.877486
a557d224-7ace-4e65-be18-159a3e2e8cfc	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S7 est en retard.	/mes-taches	f	\N	2ff5ff74-96e8-41e1-a4ee-3b0fbbd37a02	2026-07-14 09:05:23.881609
1b272b9a-28b4-4dd7-81dd-7652082befc4	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S7) est en retard.	/mes-taches	f	\N	2ff5ff74-96e8-41e1-a4ee-3b0fbbd37a02	2026-07-14 09:05:23.885412
5e331d74-056a-4d41-8b32-b3900bbbdef8	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S8 est en retard.	/mes-taches	f	\N	27ca5fe5-8373-442d-93ec-5c2ec24a5cd2	2026-07-14 09:05:23.889772
920777be-49a7-4a9d-b658-ad51eac5d3da	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S8) est en retard.	/mes-taches	f	\N	27ca5fe5-8373-442d-93ec-5c2ec24a5cd2	2026-07-14 09:05:23.893208
62263dae-bf78-48d4-b54e-f5821aa1540c	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S9 est en retard.	/mes-taches	f	\N	83263296-9905-41fc-95b0-f491e106ff76	2026-07-14 09:05:23.896413
b48af186-5455-4dc9-bb56-dba7e77e5854	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S9) est en retard.	/mes-taches	f	\N	83263296-9905-41fc-95b0-f491e106ff76	2026-07-14 09:05:23.899579
77c1980f-38e1-4029-a397-c8671fb7eeaf	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S10 est en retard.	/mes-taches	f	\N	b4b492a8-e265-4e56-8e38-53c62a662387	2026-07-14 09:05:23.904087
479965f0-b0ae-478a-b4cd-8a70c20b27e1	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S10) est en retard.	/mes-taches	f	\N	b4b492a8-e265-4e56-8e38-53c62a662387	2026-07-14 09:05:23.907725
9e1be1c0-f699-41c2-a216-9254cb085cc8	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S11 est en retard.	/mes-taches	f	\N	b6c36a49-a20a-431a-a215-66e800fa008d	2026-07-14 09:05:23.911353
4bd695bf-f404-46cb-b1df-337536ae7fd9	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S11) est en retard.	/mes-taches	f	\N	b6c36a49-a20a-431a-a215-66e800fa008d	2026-07-14 09:05:23.914355
b2472fcb-9847-4e0a-aa4a-15bc5900ac1c	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S12 est en retard.	/mes-taches	f	\N	715dd598-4606-4144-89e0-95e37e200cb4	2026-07-14 09:05:23.91761
83aff54f-f2ec-40a6-83b2-d97b88138975	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S12) est en retard.	/mes-taches	f	\N	715dd598-4606-4144-89e0-95e37e200cb4	2026-07-14 09:05:23.922224
f86eb564-ecfc-4061-8918-57129b0fbca2	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S13 est en retard.	/mes-taches	f	\N	aace607e-a533-4e7a-b028-0979a9048e24	2026-07-14 09:05:23.925354
fdcc92cd-c434-425f-a66f-6e3386abbfae	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S13) est en retard.	/mes-taches	f	\N	aace607e-a533-4e7a-b028-0979a9048e24	2026-07-14 09:05:23.92842
7d3a610a-792b-4bc0-b49e-fd65433b5e1f	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S28 est en retard.	/mes-taches	f	\N	05102cd2-6fd8-4012-9bcb-37f4f0493ec2	2026-07-14 09:05:23.931329
ed5e2c4c-8dd1-4f44-9f45-1efc0c98829d	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S28) est en retard.	/mes-taches	f	\N	05102cd2-6fd8-4012-9bcb-37f4f0493ec2	2026-07-14 09:05:23.934543
950d58d0-f440-4eb6-9444-ba4149500613	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S14 est en retard.	/mes-taches	f	\N	79df8789-64d5-4ae6-86d5-a8db931280e5	2026-07-14 09:05:23.938611
07adfa7a-1133-4b3f-9d1d-31814ebfecf1	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S14) est en retard.	/mes-taches	f	\N	79df8789-64d5-4ae6-86d5-a8db931280e5	2026-07-14 09:05:23.941845
7e8a504a-4a8f-4c85-bff5-8ea1a1b66f6c	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S15 est en retard.	/mes-taches	f	\N	02630876-54e9-4d05-9650-63ce89037779	2026-07-14 09:05:23.945007
388ac910-a085-46db-899d-f1e6686dc6b5	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S15) est en retard.	/mes-taches	f	\N	02630876-54e9-4d05-9650-63ce89037779	2026-07-14 09:05:23.947957
fdb095aa-e7c3-4866-b5b9-5159244a207c	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S16 est en retard.	/mes-taches	f	\N	80fab3c2-020d-4fd4-88c2-fabd36676055	2026-07-14 09:05:23.951559
625f3c00-2bf2-4731-96ae-69364d5b27e5	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S16) est en retard.	/mes-taches	f	\N	80fab3c2-020d-4fd4-88c2-fabd36676055	2026-07-14 09:05:23.955421
f55dc23b-aea9-4ead-90f3-84e2941c40e0	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S17 est en retard.	/mes-taches	f	\N	581038bd-54ab-4048-81d9-753997345154	2026-07-14 09:05:23.958768
688edb2a-6d79-4d78-b0e0-c5d2f32a7b5c	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S17) est en retard.	/mes-taches	f	\N	581038bd-54ab-4048-81d9-753997345154	2026-07-14 09:05:23.96199
a50ee307-e76e-49d8-aedb-79e63d2afa0c	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S18 est en retard.	/mes-taches	f	\N	81dc25ce-bb8a-4193-ad2a-3fbe5e0163db	2026-07-14 09:05:23.964997
8b2d50f0-5089-4dc3-92b6-17150da6c606	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S18) est en retard.	/mes-taches	f	\N	81dc25ce-bb8a-4193-ad2a-3fbe5e0163db	2026-07-14 09:05:23.969235
39783a75-7063-403e-9e7c-d41c00635ab7	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S19 est en retard.	/mes-taches	f	\N	c0c66aed-7cdb-4578-80a3-dcc73be9ccd6	2026-07-14 09:05:23.972485
c31cc5d4-ee32-488b-b2b4-0be75b613b49	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S19) est en retard.	/mes-taches	f	\N	c0c66aed-7cdb-4578-80a3-dcc73be9ccd6	2026-07-14 09:05:23.975307
a8d73b08-6994-4374-888e-6ff48c180f1b	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S20 est en retard.	/mes-taches	f	\N	d8f7380f-2b3e-4a2a-a5a7-af860f1b343c	2026-07-14 09:05:23.978374
3546528a-058e-4e66-b955-77cf57c495d4	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S20) est en retard.	/mes-taches	f	\N	d8f7380f-2b3e-4a2a-a5a7-af860f1b343c	2026-07-14 09:05:23.981254
c249d769-1a5a-4dde-9909-f36154ae6a23	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S21 est en retard.	/mes-taches	f	\N	aa647e0d-0e5f-4d8a-852b-9afbf0340d1c	2026-07-14 09:05:23.985536
d8af48b5-b523-447f-b296-fbc3590e4735	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S21) est en retard.	/mes-taches	f	\N	aa647e0d-0e5f-4d8a-852b-9afbf0340d1c	2026-07-14 09:05:23.988588
ce3af67f-0df8-412d-a655-f2a5d06122ca	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S22 est en retard.	/mes-taches	f	\N	4dbf96c0-938b-4f1a-9678-59d693c0e290	2026-07-14 09:05:23.991746
1a41b5fc-e29d-4a02-ae38-b4cdbba72604	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S22) est en retard.	/mes-taches	f	\N	4dbf96c0-938b-4f1a-9678-59d693c0e290	2026-07-14 09:05:23.994893
b02e07b5-30c3-4104-a771-a75c155d4dad	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S23 est en retard.	/mes-taches	f	\N	197bae46-2951-4796-909c-16a38cf5eb30	2026-07-14 09:05:23.99781
d59f8b7b-787d-4869-8a2c-368b9371a3c2	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S23) est en retard.	/mes-taches	f	\N	197bae46-2951-4796-909c-16a38cf5eb30	2026-07-14 09:05:24.002163
e61850a3-dd47-4dce-9042-b9fd53ba014d	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S24 est en retard.	/mes-taches	f	\N	f46b584c-5809-420d-9cdd-851b1745135a	2026-07-14 09:05:24.00535
6f9df5af-d55f-4f3d-a7c4-c00d156935a1	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S24) est en retard.	/mes-taches	f	\N	f46b584c-5809-420d-9cdd-851b1745135a	2026-07-14 09:05:24.008156
9c647e04-7916-405a-ba1b-84d0db47d5d3	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S25 est en retard.	/mes-taches	f	\N	ef2afd20-3330-49b9-8526-2d0c14be549d	2026-07-14 09:05:24.010959
40b0a674-16c5-406d-a976-83a4b3827285	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S25) est en retard.	/mes-taches	f	\N	ef2afd20-3330-49b9-8526-2d0c14be549d	2026-07-14 09:05:24.013779
36ff5f4a-e862-46b9-b374-2c2c27621543	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S26 est en retard.	/mes-taches	f	\N	fa9983da-12ec-498d-b859-0642828844dd	2026-07-14 09:05:24.017376
44764fe5-1fa2-4c4d-951a-52dcb125a463	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S26) est en retard.	/mes-taches	f	\N	fa9983da-12ec-498d-b859-0642828844dd	2026-07-14 09:05:24.020941
9a3ccc84-5191-4f7a-8125-e9ebd4a8afce	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	ANOMALIE_DETECTEE	Anomalie détectée	Une anomalie a été détectée lors de l'inspection Cantine.	/inspections/87e79e77-8da0-4dd4-8326-d73ac69defb8	f	\N	87e79e77-8da0-4dd4-8326-d73ac69defb8	2026-07-14 09:11:06.475394
1b383fad-1f46-48ba-b4ed-3c556a8fe94e	6f4e9c9e-5c7a-4676-8acb-8ff7f03664de	ACTION_ASSIGNEE	⚡ Nouvelle action corrective	tiba roua vous a assigné une action : "cccccccc..."	/actions/ebbe6b9c-7142-4fb9-8f94-2b5c6c4cea1a	f	\N	ebbe6b9c-7142-4fb9-8f94-2b5c6c4cea1a	2026-07-14 09:11:35.704856
a70052ea-b9cc-48ae-ae2e-8195d1398129	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Infirmerie prévue pour la semaine S27 est en retard.	/mes-taches	f	\N	fef5b0ce-7bec-4d78-8cdb-550ec934e666	2026-07-14 09:30:19.687975
bb5922d0-518b-4023-9da7-08eff82cc4c1	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Infirmerie (Semaine S27) est en retard.	/mes-taches	f	\N	fef5b0ce-7bec-4d78-8cdb-550ec934e666	2026-07-14 09:30:19.697416
ebce5303-c7f0-4f97-b51b-70c179ce5713	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S27 est en retard.	/mes-taches	f	\N	10f3ea3c-ac1d-4e6b-95a6-ddd40bcdfaf5	2026-07-14 09:30:19.70207
41a9f810-603a-42c3-b298-f47cf26dc868	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S27) est en retard.	/mes-taches	f	\N	10f3ea3c-ac1d-4e6b-95a6-ddd40bcdfaf5	2026-07-14 09:30:19.704907
46bea2dd-6404-4202-872d-6995b935c44e	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S5 est en retard.	/mes-taches	f	\N	67205465-c5f8-4fc5-b05d-6e68edb6db30	2026-07-14 09:30:19.707751
82696f13-4f8c-41b5-a160-5bf138d09f48	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S5) est en retard.	/mes-taches	f	\N	67205465-c5f8-4fc5-b05d-6e68edb6db30	2026-07-14 09:30:19.710467
c497d525-bd3a-4b02-baf3-cd2ea0dd7672	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S6 est en retard.	/mes-taches	f	\N	1f50f95c-e498-45fe-bf8c-0724cf002b47	2026-07-14 09:30:19.714062
55ad6352-d475-43ba-b76d-c3cb25166d61	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S6) est en retard.	/mes-taches	f	\N	1f50f95c-e498-45fe-bf8c-0724cf002b47	2026-07-14 09:30:19.717371
ce51fea0-1f7e-439c-b42d-d65ca4ecebf9	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S7 est en retard.	/mes-taches	f	\N	2ff5ff74-96e8-41e1-a4ee-3b0fbbd37a02	2026-07-14 09:30:19.720548
8fb6b635-0877-46d5-bda3-fa251113882a	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S7) est en retard.	/mes-taches	f	\N	2ff5ff74-96e8-41e1-a4ee-3b0fbbd37a02	2026-07-14 09:30:19.723556
35e667cc-cec5-44ed-b5c7-6914a2e96424	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S8 est en retard.	/mes-taches	f	\N	27ca5fe5-8373-442d-93ec-5c2ec24a5cd2	2026-07-14 09:30:19.726217
2673fed2-2de6-4732-8865-0f13d95b6376	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S8) est en retard.	/mes-taches	f	\N	27ca5fe5-8373-442d-93ec-5c2ec24a5cd2	2026-07-14 09:30:19.729549
17cb62df-b48f-4fe0-be08-e0ab1372d410	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S9 est en retard.	/mes-taches	f	\N	83263296-9905-41fc-95b0-f491e106ff76	2026-07-14 09:30:19.732619
2758d833-09df-41bf-a739-69ca0b23675b	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S9) est en retard.	/mes-taches	f	\N	83263296-9905-41fc-95b0-f491e106ff76	2026-07-14 09:30:19.735274
b849aba0-b869-4915-ae24-499104b47e65	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S10 est en retard.	/mes-taches	f	\N	b4b492a8-e265-4e56-8e38-53c62a662387	2026-07-14 09:30:19.737769
1c0b144d-3ec3-46f6-854d-05f7bd50c5eb	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S10) est en retard.	/mes-taches	f	\N	b4b492a8-e265-4e56-8e38-53c62a662387	2026-07-14 09:30:19.740099
0cfa79b2-5be8-4856-8568-5fcbf886f189	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S11 est en retard.	/mes-taches	f	\N	b6c36a49-a20a-431a-a215-66e800fa008d	2026-07-14 09:30:19.742405
3ec4ca3c-384b-4e63-b3fe-e4bf4b5221ca	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S11) est en retard.	/mes-taches	f	\N	b6c36a49-a20a-431a-a215-66e800fa008d	2026-07-14 09:30:19.746177
8fcacaba-6c9b-4a14-8bca-abfbb4f5b822	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S12 est en retard.	/mes-taches	f	\N	715dd598-4606-4144-89e0-95e37e200cb4	2026-07-14 09:30:19.748956
44e920a7-bab7-409d-99f7-c199bc43a846	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S12) est en retard.	/mes-taches	f	\N	715dd598-4606-4144-89e0-95e37e200cb4	2026-07-14 09:30:19.751437
3631bb35-7ec8-4ebf-9946-7493207b8125	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S13 est en retard.	/mes-taches	f	\N	aace607e-a533-4e7a-b028-0979a9048e24	2026-07-14 09:30:19.753755
588af7c6-444e-4fa3-bb1e-e1016aa77edd	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S13) est en retard.	/mes-taches	f	\N	aace607e-a533-4e7a-b028-0979a9048e24	2026-07-14 09:30:19.756047
55e9ca1b-9775-46aa-89b1-28a4f25cd324	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S28 est en retard.	/mes-taches	f	\N	05102cd2-6fd8-4012-9bcb-37f4f0493ec2	2026-07-14 09:30:19.758568
5b02a92f-98fe-49f8-a5c8-1f026330d1d4	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S28) est en retard.	/mes-taches	f	\N	05102cd2-6fd8-4012-9bcb-37f4f0493ec2	2026-07-14 09:30:19.763065
105c9990-0f0a-4db4-b23b-c5ffc4b711bd	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S14 est en retard.	/mes-taches	f	\N	79df8789-64d5-4ae6-86d5-a8db931280e5	2026-07-14 09:30:19.765555
3769ee42-bf7d-4790-84fb-819bf4807832	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S14) est en retard.	/mes-taches	f	\N	79df8789-64d5-4ae6-86d5-a8db931280e5	2026-07-14 09:30:19.768082
ed1307bc-f42b-4cc8-ae22-8895fb3b2bac	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S15 est en retard.	/mes-taches	f	\N	02630876-54e9-4d05-9650-63ce89037779	2026-07-14 09:30:19.771021
2f1b685b-4348-43b0-b71f-d8d16a2fa699	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S15) est en retard.	/mes-taches	f	\N	02630876-54e9-4d05-9650-63ce89037779	2026-07-14 09:30:19.773483
b68cc885-20e9-4d06-ac8e-c6c8d669b68e	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S16 est en retard.	/mes-taches	f	\N	80fab3c2-020d-4fd4-88c2-fabd36676055	2026-07-14 09:30:19.777489
c3f5dd31-8274-4f3d-b069-fc2034fdb92f	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S16) est en retard.	/mes-taches	f	\N	80fab3c2-020d-4fd4-88c2-fabd36676055	2026-07-14 09:30:19.780091
f63dd51f-b01d-4b64-ab09-6e7436f7e35d	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S17 est en retard.	/mes-taches	f	\N	581038bd-54ab-4048-81d9-753997345154	2026-07-14 09:30:19.782991
01364893-ff5c-4058-99e1-a9b39cd3d9cc	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S17) est en retard.	/mes-taches	f	\N	581038bd-54ab-4048-81d9-753997345154	2026-07-14 09:30:19.785392
014494f8-2b2c-430a-a9a7-93f24e44448f	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S18 est en retard.	/mes-taches	f	\N	81dc25ce-bb8a-4193-ad2a-3fbe5e0163db	2026-07-14 09:30:19.787795
ea99dcda-e024-4cf4-989a-2e28fe26bf2f	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S18) est en retard.	/mes-taches	f	\N	81dc25ce-bb8a-4193-ad2a-3fbe5e0163db	2026-07-14 09:30:19.792059
86d9e8d1-8148-4dd4-9c91-771a47a518d5	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S19 est en retard.	/mes-taches	f	\N	c0c66aed-7cdb-4578-80a3-dcc73be9ccd6	2026-07-14 09:30:19.795161
53f0d2f9-eed3-420a-94d0-499f5198c7bd	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S19) est en retard.	/mes-taches	f	\N	c0c66aed-7cdb-4578-80a3-dcc73be9ccd6	2026-07-14 09:30:19.797617
73eacce5-7a08-4ebe-862b-36b428ff19ee	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S20 est en retard.	/mes-taches	f	\N	d8f7380f-2b3e-4a2a-a5a7-af860f1b343c	2026-07-14 09:30:19.800145
0783f9d3-bebe-49bf-9d47-966788dc19d1	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S20) est en retard.	/mes-taches	f	\N	d8f7380f-2b3e-4a2a-a5a7-af860f1b343c	2026-07-14 09:30:19.802724
8ec07fbe-7e0d-48a4-b50a-9b1752668f7c	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S21 est en retard.	/mes-taches	f	\N	aa647e0d-0e5f-4d8a-852b-9afbf0340d1c	2026-07-14 09:30:19.806286
aea97593-3070-4ecd-b75b-e84e97709b7f	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S21) est en retard.	/mes-taches	f	\N	aa647e0d-0e5f-4d8a-852b-9afbf0340d1c	2026-07-14 09:30:19.809565
8cd52c11-45aa-416a-aed6-97102a783c9b	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S22 est en retard.	/mes-taches	f	\N	4dbf96c0-938b-4f1a-9678-59d693c0e290	2026-07-14 09:30:19.812335
16638fc2-423e-4786-abf6-697f5bce119d	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S22) est en retard.	/mes-taches	f	\N	4dbf96c0-938b-4f1a-9678-59d693c0e290	2026-07-14 09:30:19.815097
e8a79d51-07bd-49c3-8a48-29e110b90b7c	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S23 est en retard.	/mes-taches	f	\N	197bae46-2951-4796-909c-16a38cf5eb30	2026-07-14 09:30:19.817688
55138c61-3c22-4374-bab6-bb5f56d4c0bd	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S23) est en retard.	/mes-taches	f	\N	197bae46-2951-4796-909c-16a38cf5eb30	2026-07-14 09:30:19.820311
58b9d2ea-a8b7-4aff-8740-37ff002bbc2f	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S24 est en retard.	/mes-taches	f	\N	f46b584c-5809-420d-9cdd-851b1745135a	2026-07-14 09:30:19.823945
29807eff-1518-43ef-9be8-a61402a5c077	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S24) est en retard.	/mes-taches	f	\N	f46b584c-5809-420d-9cdd-851b1745135a	2026-07-14 09:30:19.826471
89a0b906-fb05-489f-94c5-6c42b130c9ae	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S25 est en retard.	/mes-taches	f	\N	ef2afd20-3330-49b9-8526-2d0c14be549d	2026-07-14 09:30:19.829221
a7840db1-3e4f-4917-b319-e23ae8eabd63	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S25) est en retard.	/mes-taches	f	\N	ef2afd20-3330-49b9-8526-2d0c14be549d	2026-07-14 09:30:19.831668
c164a669-d4f0-453a-977c-bdb434864cf9	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S26 est en retard.	/mes-taches	f	\N	fa9983da-12ec-498d-b859-0642828844dd	2026-07-14 09:30:19.834546
d222bbee-123b-4314-af35-1686e5c95690	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S26) est en retard.	/mes-taches	f	\N	fa9983da-12ec-498d-b859-0642828844dd	2026-07-14 09:30:19.838398
0ef973fb-0b4d-4d98-aa2f-40369d5baa5c	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Infirmerie prévue pour la semaine S27 est en retard.	/mes-taches	f	\N	fef5b0ce-7bec-4d78-8cdb-550ec934e666	2026-07-14 09:30:32.110712
a8800453-3d30-488f-be41-061bcf884176	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Infirmerie (Semaine S27) est en retard.	/mes-taches	f	\N	fef5b0ce-7bec-4d78-8cdb-550ec934e666	2026-07-14 09:30:32.115225
236a8ab9-e208-492c-a202-c6d635c5db4b	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S27 est en retard.	/mes-taches	f	\N	10f3ea3c-ac1d-4e6b-95a6-ddd40bcdfaf5	2026-07-14 09:30:32.118087
f4cd87f3-6731-4e36-8a44-6dd994553ab8	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S27) est en retard.	/mes-taches	f	\N	10f3ea3c-ac1d-4e6b-95a6-ddd40bcdfaf5	2026-07-14 09:30:32.121088
cd0f914c-2f28-4e11-95cb-18cada655e38	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S5 est en retard.	/mes-taches	f	\N	67205465-c5f8-4fc5-b05d-6e68edb6db30	2026-07-14 09:30:32.124666
7d714fba-cf4a-404b-af20-7f7d2ab4d5ea	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S5) est en retard.	/mes-taches	f	\N	67205465-c5f8-4fc5-b05d-6e68edb6db30	2026-07-14 09:30:32.127327
3645d220-df6a-4cf8-96cb-09dd1fcc9661	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S6 est en retard.	/mes-taches	f	\N	1f50f95c-e498-45fe-bf8c-0724cf002b47	2026-07-14 09:30:32.130288
e8949a68-9aec-45b6-a9a4-d7bacff91d6a	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S6) est en retard.	/mes-taches	f	\N	1f50f95c-e498-45fe-bf8c-0724cf002b47	2026-07-14 09:30:32.132871
5c09f57a-da7f-4dc8-bad2-1ebca33f60dd	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S7 est en retard.	/mes-taches	f	\N	2ff5ff74-96e8-41e1-a4ee-3b0fbbd37a02	2026-07-14 09:30:32.135669
4f54026a-eded-42ab-ac36-ecd0e3c4564d	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S7) est en retard.	/mes-taches	f	\N	2ff5ff74-96e8-41e1-a4ee-3b0fbbd37a02	2026-07-14 09:30:32.138722
62babe7a-f4c7-4e13-bda3-136305a38e82	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S8 est en retard.	/mes-taches	f	\N	27ca5fe5-8373-442d-93ec-5c2ec24a5cd2	2026-07-14 09:30:32.141177
cc2cd994-11c5-4811-9bad-3c645b700e47	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S8) est en retard.	/mes-taches	f	\N	27ca5fe5-8373-442d-93ec-5c2ec24a5cd2	2026-07-14 09:30:32.14411
aba23a5b-a48e-4f52-9adb-b81b3b5ab01c	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S9 est en retard.	/mes-taches	f	\N	83263296-9905-41fc-95b0-f491e106ff76	2026-07-14 09:30:32.146591
f2a49695-bad7-4e18-9b0b-a55a2888d20b	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S9) est en retard.	/mes-taches	f	\N	83263296-9905-41fc-95b0-f491e106ff76	2026-07-14 09:30:32.14948
5a98349a-a1db-4a8c-b934-5bd7c715d120	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S10 est en retard.	/mes-taches	f	\N	b4b492a8-e265-4e56-8e38-53c62a662387	2026-07-14 09:30:32.152142
641fe734-e6a7-4323-b713-712d8e098ecc	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S10) est en retard.	/mes-taches	f	\N	b4b492a8-e265-4e56-8e38-53c62a662387	2026-07-14 09:30:32.154583
0bdb3e09-b186-4399-a51e-82ebfdf728b7	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S11 est en retard.	/mes-taches	f	\N	b6c36a49-a20a-431a-a215-66e800fa008d	2026-07-14 09:30:32.157279
926b684c-a4e4-45b4-82c5-3c54f36e55f7	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S11) est en retard.	/mes-taches	f	\N	b6c36a49-a20a-431a-a215-66e800fa008d	2026-07-14 09:30:32.159581
e9faa1df-ddab-4359-a14a-8689dd9309a1	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S12 est en retard.	/mes-taches	f	\N	715dd598-4606-4144-89e0-95e37e200cb4	2026-07-14 09:30:32.162025
6ae87af9-2c7e-41d0-97b3-7ced68c3e36b	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S12) est en retard.	/mes-taches	f	\N	715dd598-4606-4144-89e0-95e37e200cb4	2026-07-14 09:30:32.164505
58568468-ebdd-4269-957d-4ca1ef3b449c	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S13 est en retard.	/mes-taches	f	\N	aace607e-a533-4e7a-b028-0979a9048e24	2026-07-14 09:30:32.16688
574546eb-5485-4e42-9839-d46838144bb5	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S13) est en retard.	/mes-taches	f	\N	aace607e-a533-4e7a-b028-0979a9048e24	2026-07-14 09:30:32.169906
d2784240-30f2-4522-b0d2-7b990cd8cbc6	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S28 est en retard.	/mes-taches	f	\N	05102cd2-6fd8-4012-9bcb-37f4f0493ec2	2026-07-14 09:30:32.172424
a053e2b7-9184-4f3a-93f8-b49297fd8d1d	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S28) est en retard.	/mes-taches	f	\N	05102cd2-6fd8-4012-9bcb-37f4f0493ec2	2026-07-14 09:30:32.175222
3eddef1d-7bcb-4f44-b547-66bc1a93acab	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S14 est en retard.	/mes-taches	f	\N	79df8789-64d5-4ae6-86d5-a8db931280e5	2026-07-14 09:30:32.177973
6973e233-8e8c-4dc5-ae4c-f3304414228e	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S14) est en retard.	/mes-taches	f	\N	79df8789-64d5-4ae6-86d5-a8db931280e5	2026-07-14 09:30:32.180255
3a4d3e42-cbf7-4c0d-a230-5a74777e7798	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S15 est en retard.	/mes-taches	f	\N	02630876-54e9-4d05-9650-63ce89037779	2026-07-14 09:30:32.183454
507568df-8519-4338-a85a-e608a93cc373	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S15) est en retard.	/mes-taches	f	\N	02630876-54e9-4d05-9650-63ce89037779	2026-07-14 09:30:32.186107
0de211e1-c81a-437a-8ade-13d5878aca87	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S16 est en retard.	/mes-taches	f	\N	80fab3c2-020d-4fd4-88c2-fabd36676055	2026-07-14 09:30:32.188847
286462a1-6607-4b52-a277-7506b6ff39ce	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S16) est en retard.	/mes-taches	f	\N	80fab3c2-020d-4fd4-88c2-fabd36676055	2026-07-14 09:30:32.191225
060790c8-5fc1-4c2f-b9c4-d49f5e917a7b	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S17 est en retard.	/mes-taches	f	\N	581038bd-54ab-4048-81d9-753997345154	2026-07-14 09:30:32.193929
b6954947-66b1-4efc-80b1-6da7e08e56da	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S17) est en retard.	/mes-taches	f	\N	581038bd-54ab-4048-81d9-753997345154	2026-07-14 09:30:32.196343
409c1a22-8d23-4df6-97e1-218bb3165f48	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S18 est en retard.	/mes-taches	f	\N	81dc25ce-bb8a-4193-ad2a-3fbe5e0163db	2026-07-14 09:30:32.19911
061411bd-87c2-488b-a46a-71db5d9afa33	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S18) est en retard.	/mes-taches	f	\N	81dc25ce-bb8a-4193-ad2a-3fbe5e0163db	2026-07-14 09:30:32.201982
0da189fb-38a6-4452-81f5-a8bc6469d1fc	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S19 est en retard.	/mes-taches	f	\N	c0c66aed-7cdb-4578-80a3-dcc73be9ccd6	2026-07-14 09:30:32.204497
51069a98-426f-4f07-9584-e81b6215bdad	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S19) est en retard.	/mes-taches	f	\N	c0c66aed-7cdb-4578-80a3-dcc73be9ccd6	2026-07-14 09:30:32.206982
e7d8584b-3c13-4287-90be-e1382c11beb3	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S20 est en retard.	/mes-taches	f	\N	d8f7380f-2b3e-4a2a-a5a7-af860f1b343c	2026-07-14 09:30:32.209534
f11f5400-c7c4-4d14-8f2b-c0c5d8d8e7e4	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S20) est en retard.	/mes-taches	f	\N	d8f7380f-2b3e-4a2a-a5a7-af860f1b343c	2026-07-14 09:30:32.211891
05e493c8-a7d2-49b1-a690-afe5e8cabe6a	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S21 est en retard.	/mes-taches	f	\N	aa647e0d-0e5f-4d8a-852b-9afbf0340d1c	2026-07-14 09:30:32.214799
12ab31db-138c-46ed-b599-6f4373443c35	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S21) est en retard.	/mes-taches	f	\N	aa647e0d-0e5f-4d8a-852b-9afbf0340d1c	2026-07-14 09:30:32.217227
c7f77cf4-d4f8-4f60-9062-5b67085e4cc4	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S22 est en retard.	/mes-taches	f	\N	4dbf96c0-938b-4f1a-9678-59d693c0e290	2026-07-14 09:30:32.219631
99e3201a-842b-4989-998a-4a6e517906e6	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S22) est en retard.	/mes-taches	f	\N	4dbf96c0-938b-4f1a-9678-59d693c0e290	2026-07-14 09:30:32.222107
032e901c-cc2a-4dd0-b52d-3e4e16b2f1e5	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S23 est en retard.	/mes-taches	f	\N	197bae46-2951-4796-909c-16a38cf5eb30	2026-07-14 09:30:32.224635
81805fd4-6c29-410a-b1f3-76f26b2115c6	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S23) est en retard.	/mes-taches	f	\N	197bae46-2951-4796-909c-16a38cf5eb30	2026-07-14 09:30:32.227441
fd1a3cb4-2c74-44cc-86e8-1437e6059709	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S24 est en retard.	/mes-taches	f	\N	f46b584c-5809-420d-9cdd-851b1745135a	2026-07-14 09:30:32.230035
1fc082d9-3adf-40a7-b598-32505ace62bc	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S24) est en retard.	/mes-taches	f	\N	f46b584c-5809-420d-9cdd-851b1745135a	2026-07-14 09:30:32.232329
a703c70e-a35a-4399-8e88-f697156a12ab	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S25 est en retard.	/mes-taches	f	\N	ef2afd20-3330-49b9-8526-2d0c14be549d	2026-07-14 09:30:32.234806
ef2e4c4a-fa85-48b9-8138-f86149574e67	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S25) est en retard.	/mes-taches	f	\N	ef2afd20-3330-49b9-8526-2d0c14be549d	2026-07-14 09:30:32.237111
50f1bee1-17eb-4509-b9d8-de008e0517ac	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S26 est en retard.	/mes-taches	f	\N	fa9983da-12ec-498d-b859-0642828844dd	2026-07-14 09:30:32.240227
7b97bded-f197-4c02-b800-6868356e57c9	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S26) est en retard.	/mes-taches	f	\N	fa9983da-12ec-498d-b859-0642828844dd	2026-07-14 09:30:32.242635
7af69704-2925-4602-bd5a-7ced17379183	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Infirmerie prévue pour la semaine S27 est en retard.	/mes-taches	f	\N	fef5b0ce-7bec-4d78-8cdb-550ec934e666	2026-07-15 09:39:37.350191
8fc16847-de76-4a96-aff1-eab8e9ef2e88	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Infirmerie (Semaine S27) est en retard.	/mes-taches	f	\N	fef5b0ce-7bec-4d78-8cdb-550ec934e666	2026-07-15 09:39:37.371321
17034d4e-f08e-44cd-bb9a-4847bdbc5e39	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S27 est en retard.	/mes-taches	f	\N	10f3ea3c-ac1d-4e6b-95a6-ddd40bcdfaf5	2026-07-15 09:39:37.375618
a1108a06-27d1-4f4a-9eaf-988740625838	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S27) est en retard.	/mes-taches	f	\N	10f3ea3c-ac1d-4e6b-95a6-ddd40bcdfaf5	2026-07-15 09:39:37.381867
f51e01cb-4f06-444e-b718-734ac29d66be	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S5 est en retard.	/mes-taches	f	\N	67205465-c5f8-4fc5-b05d-6e68edb6db30	2026-07-15 09:39:37.385816
b967bf6f-238e-45df-9b53-24ff772ebd8d	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S5) est en retard.	/mes-taches	f	\N	67205465-c5f8-4fc5-b05d-6e68edb6db30	2026-07-15 09:39:37.390062
cf1392c7-b294-445b-88f7-85ac38bcebd4	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S6 est en retard.	/mes-taches	f	\N	1f50f95c-e498-45fe-bf8c-0724cf002b47	2026-07-15 09:39:37.395847
c5e6926f-7bf9-40ba-86ac-4f1cb088c3cc	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S6) est en retard.	/mes-taches	f	\N	1f50f95c-e498-45fe-bf8c-0724cf002b47	2026-07-15 09:39:37.399802
354d61ec-2136-4eba-be60-18bf58eecb0f	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S7 est en retard.	/mes-taches	f	\N	2ff5ff74-96e8-41e1-a4ee-3b0fbbd37a02	2026-07-15 09:39:37.403733
1eee7516-cc1a-4ca6-a1b3-aedd1de6e9cb	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S7) est en retard.	/mes-taches	f	\N	2ff5ff74-96e8-41e1-a4ee-3b0fbbd37a02	2026-07-15 09:39:37.407469
f71ef7f6-6142-4aa2-8d62-0cdf4167e496	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S8 est en retard.	/mes-taches	f	\N	27ca5fe5-8373-442d-93ec-5c2ec24a5cd2	2026-07-15 09:39:37.413126
c8edf533-2b50-4f09-b88b-29d1814eef28	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S8) est en retard.	/mes-taches	f	\N	27ca5fe5-8373-442d-93ec-5c2ec24a5cd2	2026-07-15 09:39:37.417099
36ca9cac-b100-4d73-a125-9be93c18ab50	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S9 est en retard.	/mes-taches	f	\N	83263296-9905-41fc-95b0-f491e106ff76	2026-07-15 09:39:37.420376
0594ab95-8e6d-4fbb-aaa6-f5dfb07eec76	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S9) est en retard.	/mes-taches	f	\N	83263296-9905-41fc-95b0-f491e106ff76	2026-07-15 09:39:37.423505
dfdd5e02-1892-4fab-95b4-95bc49a85412	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S10 est en retard.	/mes-taches	f	\N	b4b492a8-e265-4e56-8e38-53c62a662387	2026-07-15 09:39:37.428869
8218d43f-4cbd-4019-ab6c-790d7d4c5790	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S10) est en retard.	/mes-taches	f	\N	b4b492a8-e265-4e56-8e38-53c62a662387	2026-07-15 09:39:37.432525
e10fe50e-dce6-4077-9d4d-afc8505a63c2	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S11 est en retard.	/mes-taches	f	\N	b6c36a49-a20a-431a-a215-66e800fa008d	2026-07-15 09:39:37.435555
99cce465-473c-4022-9f28-ae2dceebb4ba	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S11) est en retard.	/mes-taches	f	\N	b6c36a49-a20a-431a-a215-66e800fa008d	2026-07-15 09:39:37.438648
13b504c1-6d49-45e8-aa63-2d68d54c1442	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S12 est en retard.	/mes-taches	f	\N	715dd598-4606-4144-89e0-95e37e200cb4	2026-07-15 09:39:37.442126
e5049d6e-759e-4ab2-be58-cecf6d67a367	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S12) est en retard.	/mes-taches	f	\N	715dd598-4606-4144-89e0-95e37e200cb4	2026-07-15 09:39:37.446826
2ea7f336-6033-4f6f-be80-bfb53b9df672	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S13 est en retard.	/mes-taches	f	\N	aace607e-a533-4e7a-b028-0979a9048e24	2026-07-15 09:39:37.450357
2d1d0ef5-eb10-4770-845a-cf7e33272c74	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S13) est en retard.	/mes-taches	f	\N	aace607e-a533-4e7a-b028-0979a9048e24	2026-07-15 09:39:37.453228
5e0fc81e-3a5b-4242-90bc-135292ad38ba	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S28 est en retard.	/mes-taches	f	\N	05102cd2-6fd8-4012-9bcb-37f4f0493ec2	2026-07-15 09:39:37.456725
9c8e41b1-38e1-41bb-ae74-9afd8ef9a870	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S28) est en retard.	/mes-taches	f	\N	05102cd2-6fd8-4012-9bcb-37f4f0493ec2	2026-07-15 09:39:37.460096
7d15869f-3595-4605-af4e-8d55e2043cd6	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S14 est en retard.	/mes-taches	f	\N	79df8789-64d5-4ae6-86d5-a8db931280e5	2026-07-15 09:39:37.46411
4edc2c9d-ab8f-4420-9e34-f1c119613bec	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S14) est en retard.	/mes-taches	f	\N	79df8789-64d5-4ae6-86d5-a8db931280e5	2026-07-15 09:39:37.466951
3991365e-8a4d-4742-9819-8735ac30de2d	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S15 est en retard.	/mes-taches	f	\N	02630876-54e9-4d05-9650-63ce89037779	2026-07-15 09:39:37.469926
ee1d34b3-6a3c-4cf6-a177-9e449f11c78b	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S15) est en retard.	/mes-taches	f	\N	02630876-54e9-4d05-9650-63ce89037779	2026-07-15 09:39:37.473468
f0ed7a8c-037d-4316-8709-7f467a4350a0	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S16 est en retard.	/mes-taches	f	\N	80fab3c2-020d-4fd4-88c2-fabd36676055	2026-07-15 09:39:37.478772
7f679b86-1718-4565-90ae-497131541665	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S16) est en retard.	/mes-taches	f	\N	80fab3c2-020d-4fd4-88c2-fabd36676055	2026-07-15 09:39:37.481912
b7eb5000-7599-48a9-9da9-ba8c7de5f867	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S17 est en retard.	/mes-taches	f	\N	581038bd-54ab-4048-81d9-753997345154	2026-07-15 09:39:37.485186
f58d3637-1b15-4c03-82cc-e75fdd52bed2	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S17) est en retard.	/mes-taches	f	\N	581038bd-54ab-4048-81d9-753997345154	2026-07-15 09:39:37.489533
4806c838-8897-4cd0-8842-fbb84a86c957	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S18 est en retard.	/mes-taches	f	\N	81dc25ce-bb8a-4193-ad2a-3fbe5e0163db	2026-07-15 09:39:37.497094
997c5dfa-75a2-4049-b3a1-69985108279c	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S18) est en retard.	/mes-taches	f	\N	81dc25ce-bb8a-4193-ad2a-3fbe5e0163db	2026-07-15 09:39:37.503897
7d397b38-45e7-4581-a940-4fb9e13b8e75	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S19 est en retard.	/mes-taches	f	\N	c0c66aed-7cdb-4578-80a3-dcc73be9ccd6	2026-07-15 09:39:37.510654
a4b17212-68c4-4fca-a373-749d077569a6	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S19) est en retard.	/mes-taches	f	\N	c0c66aed-7cdb-4578-80a3-dcc73be9ccd6	2026-07-15 09:39:37.517667
b8206d75-4464-470a-9015-7fce6b823265	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S20 est en retard.	/mes-taches	f	\N	d8f7380f-2b3e-4a2a-a5a7-af860f1b343c	2026-07-15 09:39:37.522445
0468773d-56f0-4b45-9c93-ba77d19451ed	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S20) est en retard.	/mes-taches	f	\N	d8f7380f-2b3e-4a2a-a5a7-af860f1b343c	2026-07-15 09:39:37.527472
55e8eb54-4459-431c-8998-86f82b14219e	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S21 est en retard.	/mes-taches	f	\N	aa647e0d-0e5f-4d8a-852b-9afbf0340d1c	2026-07-15 09:39:37.533612
3e172f42-70f0-44e5-863d-442458ecef0c	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S21) est en retard.	/mes-taches	f	\N	aa647e0d-0e5f-4d8a-852b-9afbf0340d1c	2026-07-15 09:39:37.539178
00a9bcc4-8e84-4a91-b712-c707df875168	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S22 est en retard.	/mes-taches	f	\N	4dbf96c0-938b-4f1a-9678-59d693c0e290	2026-07-15 09:39:37.545307
89c1a4fa-3f2c-4acf-ac53-b80b7f483804	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S22) est en retard.	/mes-taches	f	\N	4dbf96c0-938b-4f1a-9678-59d693c0e290	2026-07-15 09:39:37.550191
6a376e0c-6dfb-43f6-ac58-00e265c9211f	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S23 est en retard.	/mes-taches	f	\N	197bae46-2951-4796-909c-16a38cf5eb30	2026-07-15 09:39:37.556135
c128630b-bd61-4441-a6ae-b41d06bc4fbe	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S23) est en retard.	/mes-taches	f	\N	197bae46-2951-4796-909c-16a38cf5eb30	2026-07-15 09:39:37.572337
1d7d944d-4439-456b-b908-073e8774a221	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S24 est en retard.	/mes-taches	f	\N	f46b584c-5809-420d-9cdd-851b1745135a	2026-07-15 09:39:37.592913
2bb120b6-b403-42d4-9b1d-ffcf134b369a	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S24) est en retard.	/mes-taches	f	\N	f46b584c-5809-420d-9cdd-851b1745135a	2026-07-15 09:39:37.610707
f673a5f7-8046-4147-b741-3a376f6615f6	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S25 est en retard.	/mes-taches	f	\N	ef2afd20-3330-49b9-8526-2d0c14be549d	2026-07-15 09:39:37.628735
6df508f4-f238-4713-844d-e85d454b6cff	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S25) est en retard.	/mes-taches	f	\N	ef2afd20-3330-49b9-8526-2d0c14be549d	2026-07-15 09:39:37.647314
ab48943c-b28a-4e46-a880-353f40d259e6	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S26 est en retard.	/mes-taches	f	\N	fa9983da-12ec-498d-b859-0642828844dd	2026-07-15 09:39:37.661956
91d75a03-70ec-4779-8aa6-d3e7d401c03c	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S26) est en retard.	/mes-taches	f	\N	fa9983da-12ec-498d-b859-0642828844dd	2026-07-15 09:39:37.676814
2f37a214-5d0f-4a82-b5b9-bca1f65841ac	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Infirmerie prévue pour la semaine S27 est en retard.	/mes-taches	f	\N	fef5b0ce-7bec-4d78-8cdb-550ec934e666	2026-07-16 08:05:07.026575
b80133fb-4f13-4642-b2cf-92aa5782e57f	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Infirmerie (Semaine S27) est en retard.	/mes-taches	f	\N	fef5b0ce-7bec-4d78-8cdb-550ec934e666	2026-07-16 08:05:07.044638
c89ec18f-e024-4cad-8866-df107b429701	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S27 est en retard.	/mes-taches	f	\N	10f3ea3c-ac1d-4e6b-95a6-ddd40bcdfaf5	2026-07-16 08:05:07.047924
18f8d763-8f2b-450f-8ddf-fbb1dc1a5c63	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S27) est en retard.	/mes-taches	f	\N	10f3ea3c-ac1d-4e6b-95a6-ddd40bcdfaf5	2026-07-16 08:05:07.051407
1356b665-7c8f-4acb-9129-476aad20333a	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S5 est en retard.	/mes-taches	f	\N	67205465-c5f8-4fc5-b05d-6e68edb6db30	2026-07-16 08:05:07.057185
9f96467f-9ff4-45ee-b873-db2432af328c	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S5) est en retard.	/mes-taches	f	\N	67205465-c5f8-4fc5-b05d-6e68edb6db30	2026-07-16 08:05:07.060449
6f945e5c-3cb8-4f5e-8dd5-f2028ba7fad0	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S6 est en retard.	/mes-taches	f	\N	1f50f95c-e498-45fe-bf8c-0724cf002b47	2026-07-16 08:05:07.063365
35eefad8-358d-4cfa-bfe0-cc421c8eb7ba	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S6) est en retard.	/mes-taches	f	\N	1f50f95c-e498-45fe-bf8c-0724cf002b47	2026-07-16 08:05:07.066388
e68cd11e-58ab-46f9-a4e2-72084b10091f	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S7 est en retard.	/mes-taches	f	\N	2ff5ff74-96e8-41e1-a4ee-3b0fbbd37a02	2026-07-16 08:05:07.095437
86d4deb6-ec0e-4eaf-9a02-65f2bea016fb	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S7) est en retard.	/mes-taches	f	\N	2ff5ff74-96e8-41e1-a4ee-3b0fbbd37a02	2026-07-16 08:05:07.099922
32f63646-3367-4173-9834-e2326b764cc1	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S8 est en retard.	/mes-taches	f	\N	27ca5fe5-8373-442d-93ec-5c2ec24a5cd2	2026-07-16 08:05:07.104824
ea8f2245-e54d-4031-a58d-283a6970b153	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S8) est en retard.	/mes-taches	f	\N	27ca5fe5-8373-442d-93ec-5c2ec24a5cd2	2026-07-16 08:05:07.107942
386db992-ae5c-4888-bd08-dd30992ef32f	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S9 est en retard.	/mes-taches	f	\N	83263296-9905-41fc-95b0-f491e106ff76	2026-07-16 08:05:07.110826
260c5587-d85b-4a10-bd16-fb377392e9e4	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S9) est en retard.	/mes-taches	f	\N	83263296-9905-41fc-95b0-f491e106ff76	2026-07-16 08:05:07.114847
b8f4947a-f949-41eb-b83a-7a0c3cde7ac7	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S10 est en retard.	/mes-taches	f	\N	b4b492a8-e265-4e56-8e38-53c62a662387	2026-07-16 08:05:07.117659
24ddceec-ff22-4416-8adb-adae21742966	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S10) est en retard.	/mes-taches	f	\N	b4b492a8-e265-4e56-8e38-53c62a662387	2026-07-16 08:05:07.122386
30586756-bb30-4a5e-af9a-7430e9c31fc8	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S11 est en retard.	/mes-taches	f	\N	b6c36a49-a20a-431a-a215-66e800fa008d	2026-07-16 08:05:07.125506
5c40ada5-bee9-41a1-8049-d903114ffc6e	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S11) est en retard.	/mes-taches	f	\N	b6c36a49-a20a-431a-a215-66e800fa008d	2026-07-16 08:05:07.128897
c6b595cc-d523-473f-91a7-c79ae30d4a3a	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S12 est en retard.	/mes-taches	f	\N	715dd598-4606-4144-89e0-95e37e200cb4	2026-07-16 08:05:07.132325
6ee6c845-b599-4143-8816-85c1115e445d	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S12) est en retard.	/mes-taches	f	\N	715dd598-4606-4144-89e0-95e37e200cb4	2026-07-16 08:05:07.135801
ebd49410-658a-4618-ab6b-665013a73e12	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S13 est en retard.	/mes-taches	f	\N	aace607e-a533-4e7a-b028-0979a9048e24	2026-07-16 08:05:07.140437
3ec04ea8-a46c-4e60-961c-3a74dbb1e046	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S13) est en retard.	/mes-taches	f	\N	aace607e-a533-4e7a-b028-0979a9048e24	2026-07-16 08:05:07.143573
2c10d65e-db96-485e-8a3c-8b88c334646a	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S28 est en retard.	/mes-taches	f	\N	05102cd2-6fd8-4012-9bcb-37f4f0493ec2	2026-07-16 08:05:07.14624
34a74001-5b99-4627-bcef-0638e4f16bf3	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S28) est en retard.	/mes-taches	f	\N	05102cd2-6fd8-4012-9bcb-37f4f0493ec2	2026-07-16 08:05:07.149489
3317506e-52b2-4ee2-80e2-aea0e85cd94c	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S14 est en retard.	/mes-taches	f	\N	79df8789-64d5-4ae6-86d5-a8db931280e5	2026-07-16 08:05:07.152507
08fe3b6a-5c9d-4795-ac0c-05abb6567060	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S14) est en retard.	/mes-taches	f	\N	79df8789-64d5-4ae6-86d5-a8db931280e5	2026-07-16 08:05:07.157584
9dfb625f-87c7-4573-b18b-cebbaf46d226	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S15 est en retard.	/mes-taches	f	\N	02630876-54e9-4d05-9650-63ce89037779	2026-07-16 08:05:07.160764
6fd58bdd-c34f-4cd8-b5b8-13f54657b253	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S15) est en retard.	/mes-taches	f	\N	02630876-54e9-4d05-9650-63ce89037779	2026-07-16 08:05:07.163735
78ada0bc-1ba6-4ad8-b9e4-6765e72b7ad8	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S16 est en retard.	/mes-taches	f	\N	80fab3c2-020d-4fd4-88c2-fabd36676055	2026-07-16 08:05:07.166492
9223442a-4b0a-44f4-8127-c1928b7c50b0	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S16) est en retard.	/mes-taches	f	\N	80fab3c2-020d-4fd4-88c2-fabd36676055	2026-07-16 08:05:07.169677
0a9b33ec-8e64-401c-a4ad-ac0d46c96d4a	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S17 est en retard.	/mes-taches	f	\N	581038bd-54ab-4048-81d9-753997345154	2026-07-16 08:05:07.174609
2beba0f1-a420-49ae-a8c0-01a576a11e81	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S17) est en retard.	/mes-taches	f	\N	581038bd-54ab-4048-81d9-753997345154	2026-07-16 08:05:07.178178
2be3dfb5-a18e-45f4-8205-00ce56de27f8	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S18 est en retard.	/mes-taches	f	\N	81dc25ce-bb8a-4193-ad2a-3fbe5e0163db	2026-07-16 08:05:07.181332
20e9a155-26ff-42e8-a4b0-b91207983c54	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S18) est en retard.	/mes-taches	f	\N	81dc25ce-bb8a-4193-ad2a-3fbe5e0163db	2026-07-16 08:05:07.18444
97860373-75ee-44e7-9fd9-183bc784657e	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S19 est en retard.	/mes-taches	f	\N	c0c66aed-7cdb-4578-80a3-dcc73be9ccd6	2026-07-16 08:05:07.188941
096ab155-b7ed-4c2e-8a06-050cf4d6587a	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S19) est en retard.	/mes-taches	f	\N	c0c66aed-7cdb-4578-80a3-dcc73be9ccd6	2026-07-16 08:05:07.19269
dfcdce89-7ee8-40c6-881d-57741cf41310	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S20 est en retard.	/mes-taches	f	\N	d8f7380f-2b3e-4a2a-a5a7-af860f1b343c	2026-07-16 08:05:07.195555
1da56506-0dae-4088-9b31-49ee0b9fdd1c	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S20) est en retard.	/mes-taches	f	\N	d8f7380f-2b3e-4a2a-a5a7-af860f1b343c	2026-07-16 08:05:07.198546
cf0433c4-3e6e-48e7-a0b5-36736935fb62	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S21 est en retard.	/mes-taches	f	\N	aa647e0d-0e5f-4d8a-852b-9afbf0340d1c	2026-07-16 08:05:07.20111
e50c8631-6ea6-40da-9bb5-788c548d601c	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S21) est en retard.	/mes-taches	f	\N	aa647e0d-0e5f-4d8a-852b-9afbf0340d1c	2026-07-16 08:05:07.205233
cbb0a40c-1054-4764-a5ec-25689df095f0	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S22 est en retard.	/mes-taches	f	\N	4dbf96c0-938b-4f1a-9678-59d693c0e290	2026-07-16 08:05:07.209097
0ccf2862-0fb7-4098-a8c4-3d460ccbddee	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S22) est en retard.	/mes-taches	f	\N	4dbf96c0-938b-4f1a-9678-59d693c0e290	2026-07-16 08:05:07.212219
39088905-fe83-40dd-8843-013e2e47f3a9	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S23 est en retard.	/mes-taches	f	\N	197bae46-2951-4796-909c-16a38cf5eb30	2026-07-16 08:05:07.214904
7a97d8a2-3d16-49d2-be38-29ad50545fb2	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S23) est en retard.	/mes-taches	f	\N	197bae46-2951-4796-909c-16a38cf5eb30	2026-07-16 08:05:07.217774
7892804e-a34b-4e54-8333-d396681d0ddf	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S24 est en retard.	/mes-taches	f	\N	f46b584c-5809-420d-9cdd-851b1745135a	2026-07-16 08:05:07.222365
904240ce-8ebf-498e-9157-c80e6798dd8d	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S24) est en retard.	/mes-taches	f	\N	f46b584c-5809-420d-9cdd-851b1745135a	2026-07-16 08:05:07.225882
f8285c04-b78c-4f52-abee-6a06f09c6942	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S25 est en retard.	/mes-taches	f	\N	ef2afd20-3330-49b9-8526-2d0c14be549d	2026-07-16 08:05:07.228671
406a5e46-a4b0-4d0f-a6ea-0d4efcac489b	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S25) est en retard.	/mes-taches	f	\N	ef2afd20-3330-49b9-8526-2d0c14be549d	2026-07-16 08:05:07.231475
3556d61c-f7b5-44a7-90c4-4220f0d4a162	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S26 est en retard.	/mes-taches	f	\N	fa9983da-12ec-498d-b859-0642828844dd	2026-07-16 08:05:07.234405
49fa59c8-f711-48ad-8eea-d806c062d206	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S26) est en retard.	/mes-taches	f	\N	fa9983da-12ec-498d-b859-0642828844dd	2026-07-16 08:05:07.239226
40ba6801-d3ad-4b39-ba73-f2b81dbd44e5	bdd9c427-20ec-4456-bc3d-91c23859a150	ACTION_TERMINEE	✅ Action corrective terminée	Le pilote raoua a marqué l'action comme terminée : "cccccccc..."	/actions/ebbe6b9c-7142-4fb9-8f94-2b5c6c4cea1a	f	\N	ebbe6b9c-7142-4fb9-8f94-2b5c6c4cea1a	2026-07-16 08:06:09.247436
265707ef-ff60-49e9-94a9-544293e8d1b5	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S29 est en retard.	/mes-taches	f	\N	5e8ed279-980f-415b-a474-d926f99d78a4	2026-07-20 09:19:08.260969
c3e531ae-bedb-4453-8c47-8f8bc0b6d09e	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S29) est en retard.	/mes-taches	f	\N	5e8ed279-980f-415b-a474-d926f99d78a4	2026-07-20 09:19:08.32086
ceb3bcf8-c725-4955-b50f-11a5db6fbeb8	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Infirmerie prévue pour la semaine S27 est en retard.	/mes-taches	f	\N	fef5b0ce-7bec-4d78-8cdb-550ec934e666	2026-07-20 09:19:08.327874
aa3bda87-48bd-4ae8-a2f4-93074dc31e55	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Infirmerie (Semaine S27) est en retard.	/mes-taches	f	\N	fef5b0ce-7bec-4d78-8cdb-550ec934e666	2026-07-20 09:19:08.331759
1f4c60c9-4a38-4134-afcc-181135cf2e6b	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S27 est en retard.	/mes-taches	f	\N	10f3ea3c-ac1d-4e6b-95a6-ddd40bcdfaf5	2026-07-20 09:19:08.33535
332c9ac8-a0e7-48f1-8c26-1ab0fe5e7b58	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S27) est en retard.	/mes-taches	f	\N	10f3ea3c-ac1d-4e6b-95a6-ddd40bcdfaf5	2026-07-20 09:19:08.340239
8bca35f2-a21e-4433-a30b-66aea38fc8dd	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S5 est en retard.	/mes-taches	f	\N	67205465-c5f8-4fc5-b05d-6e68edb6db30	2026-07-20 09:19:08.344274
b7e7b192-a186-421a-b002-eb51fcf305f3	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S5) est en retard.	/mes-taches	f	\N	67205465-c5f8-4fc5-b05d-6e68edb6db30	2026-07-20 09:19:08.348457
ba3c9430-20ef-44c1-991b-75ea66f353bd	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S6 est en retard.	/mes-taches	f	\N	1f50f95c-e498-45fe-bf8c-0724cf002b47	2026-07-20 09:19:08.352012
7ac4497f-89ec-4228-b490-274a47160e71	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S6) est en retard.	/mes-taches	f	\N	1f50f95c-e498-45fe-bf8c-0724cf002b47	2026-07-20 09:19:08.355354
ec7177db-245f-418c-8ef9-32bdec6bb2a9	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S7 est en retard.	/mes-taches	f	\N	2ff5ff74-96e8-41e1-a4ee-3b0fbbd37a02	2026-07-20 09:19:08.358918
8edc0130-ea9f-4412-a8f3-677b1a7df8a9	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S7) est en retard.	/mes-taches	f	\N	2ff5ff74-96e8-41e1-a4ee-3b0fbbd37a02	2026-07-20 09:19:08.363002
a3e2b232-4ce1-4224-a504-1ff162996e15	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S8 est en retard.	/mes-taches	f	\N	27ca5fe5-8373-442d-93ec-5c2ec24a5cd2	2026-07-20 09:19:08.367341
b97d23b1-590e-433c-ab57-1198298a02ca	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S8) est en retard.	/mes-taches	f	\N	27ca5fe5-8373-442d-93ec-5c2ec24a5cd2	2026-07-20 09:19:08.371974
224d0e60-e705-4579-ba89-3bdcfcc76720	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S9 est en retard.	/mes-taches	f	\N	83263296-9905-41fc-95b0-f491e106ff76	2026-07-20 09:19:08.376602
5cfa816d-6c8a-4150-b85b-39b8cf8311ad	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S9) est en retard.	/mes-taches	f	\N	83263296-9905-41fc-95b0-f491e106ff76	2026-07-20 09:19:08.379949
49401463-0624-45b2-923c-0f01b474d01f	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S10 est en retard.	/mes-taches	f	\N	b4b492a8-e265-4e56-8e38-53c62a662387	2026-07-20 09:19:08.383956
ff1597c6-bc74-4d33-b058-c05aa5bd22f0	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S10) est en retard.	/mes-taches	f	\N	b4b492a8-e265-4e56-8e38-53c62a662387	2026-07-20 09:19:08.387236
4134f147-9fe3-452b-b73f-b56d8cfaaafb	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S11 est en retard.	/mes-taches	f	\N	b6c36a49-a20a-431a-a215-66e800fa008d	2026-07-20 09:19:08.390435
db56e8b1-c9db-4384-b000-98db333b3b2b	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S11) est en retard.	/mes-taches	f	\N	b6c36a49-a20a-431a-a215-66e800fa008d	2026-07-20 09:19:08.393776
04cbb740-5a4a-4984-8ace-75ed6bcc9706	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S12 est en retard.	/mes-taches	f	\N	715dd598-4606-4144-89e0-95e37e200cb4	2026-07-20 09:19:08.396909
dcd205a7-771c-4ad2-9a3b-9f246394ae69	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S12) est en retard.	/mes-taches	f	\N	715dd598-4606-4144-89e0-95e37e200cb4	2026-07-20 09:19:08.401483
e5150f87-e5f5-4f54-98ad-0dd30c8c8db6	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S13 est en retard.	/mes-taches	f	\N	aace607e-a533-4e7a-b028-0979a9048e24	2026-07-20 09:19:08.40608
ebd470a7-3b1f-494e-956b-b9aad27a867d	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S13) est en retard.	/mes-taches	f	\N	aace607e-a533-4e7a-b028-0979a9048e24	2026-07-20 09:19:08.409674
717335c1-1dd9-449b-9817-8a8c74191af7	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S28 est en retard.	/mes-taches	f	\N	05102cd2-6fd8-4012-9bcb-37f4f0493ec2	2026-07-20 09:19:08.413368
1b5cb925-8a3f-4681-82b7-f7c1c29fed93	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S28) est en retard.	/mes-taches	f	\N	05102cd2-6fd8-4012-9bcb-37f4f0493ec2	2026-07-20 09:19:08.446669
e5b48cb6-bac1-4485-b7db-0f36007d0291	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S14 est en retard.	/mes-taches	f	\N	79df8789-64d5-4ae6-86d5-a8db931280e5	2026-07-20 09:19:08.450931
17139220-084a-46ba-a162-4a6c29941ed7	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S14) est en retard.	/mes-taches	f	\N	79df8789-64d5-4ae6-86d5-a8db931280e5	2026-07-20 09:19:08.455062
3f19c0c2-8c1c-41bf-99db-2030bef0e876	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S15 est en retard.	/mes-taches	f	\N	02630876-54e9-4d05-9650-63ce89037779	2026-07-20 09:19:08.459075
d7ba5f87-6331-4fff-b69c-4a013c85bc9d	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S15) est en retard.	/mes-taches	f	\N	02630876-54e9-4d05-9650-63ce89037779	2026-07-20 09:19:08.462875
1fa6c74b-b97b-49bb-a82c-7d3b082963e2	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S16 est en retard.	/mes-taches	f	\N	80fab3c2-020d-4fd4-88c2-fabd36676055	2026-07-20 09:19:08.466263
3538d179-40be-4617-aa58-658ea62a28b1	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S16) est en retard.	/mes-taches	f	\N	80fab3c2-020d-4fd4-88c2-fabd36676055	2026-07-20 09:19:08.469366
9ebbc7c4-a103-4dfd-9b5e-8f5dbc9cf2c7	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S17 est en retard.	/mes-taches	f	\N	581038bd-54ab-4048-81d9-753997345154	2026-07-20 09:19:08.473766
0556737e-432d-4784-a816-97f47ae8c55f	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S17) est en retard.	/mes-taches	f	\N	581038bd-54ab-4048-81d9-753997345154	2026-07-20 09:19:08.477482
e4b7feca-6968-4956-83bb-dadf014f1b52	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S18 est en retard.	/mes-taches	f	\N	81dc25ce-bb8a-4193-ad2a-3fbe5e0163db	2026-07-20 09:19:08.480824
773e97c6-ab0f-4393-af6b-1851820dc7ee	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S18) est en retard.	/mes-taches	f	\N	81dc25ce-bb8a-4193-ad2a-3fbe5e0163db	2026-07-20 09:19:08.484181
bb7dbe8d-88b8-46ca-9cd0-666dffc92f01	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S19 est en retard.	/mes-taches	f	\N	c0c66aed-7cdb-4578-80a3-dcc73be9ccd6	2026-07-20 09:19:08.48728
5f1f85e4-b2d8-4638-b588-9cb8f854ae14	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S19) est en retard.	/mes-taches	f	\N	c0c66aed-7cdb-4578-80a3-dcc73be9ccd6	2026-07-20 09:19:08.490701
24863e06-15e8-42d9-b305-03d40d772005	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S20 est en retard.	/mes-taches	f	\N	d8f7380f-2b3e-4a2a-a5a7-af860f1b343c	2026-07-20 09:19:08.494448
9df21ba5-bda3-43e1-a531-124bacf8b82b	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S20) est en retard.	/mes-taches	f	\N	d8f7380f-2b3e-4a2a-a5a7-af860f1b343c	2026-07-20 09:19:08.498124
a5cd95d2-474a-4a09-94d8-f1a1f2ace2b0	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S21 est en retard.	/mes-taches	f	\N	aa647e0d-0e5f-4d8a-852b-9afbf0340d1c	2026-07-20 09:19:08.502975
fa3732c5-dc4f-4d6f-8c47-12c9973c4eb0	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S21) est en retard.	/mes-taches	f	\N	aa647e0d-0e5f-4d8a-852b-9afbf0340d1c	2026-07-20 09:19:08.507338
6992e5fd-ffd4-42f9-9acf-6cc49033fb59	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S22 est en retard.	/mes-taches	f	\N	4dbf96c0-938b-4f1a-9678-59d693c0e290	2026-07-20 09:19:08.511876
6067d774-6a14-46c7-9bf5-f740b2456a2c	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S22) est en retard.	/mes-taches	f	\N	4dbf96c0-938b-4f1a-9678-59d693c0e290	2026-07-20 09:19:08.516454
2781a8d5-7735-4495-8daf-0193a2697a4c	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S23 est en retard.	/mes-taches	f	\N	197bae46-2951-4796-909c-16a38cf5eb30	2026-07-20 09:19:08.520162
f8fe2626-dfbb-4379-ad1e-b75a757a4ca6	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S23) est en retard.	/mes-taches	f	\N	197bae46-2951-4796-909c-16a38cf5eb30	2026-07-20 09:19:08.524272
56b2b548-c831-4f18-8b41-9ef57b0a4e79	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S24 est en retard.	/mes-taches	f	\N	f46b584c-5809-420d-9cdd-851b1745135a	2026-07-20 09:19:08.529125
6f2d69ce-6f43-4964-9b52-114d26e801f7	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S24) est en retard.	/mes-taches	f	\N	f46b584c-5809-420d-9cdd-851b1745135a	2026-07-20 09:19:08.532628
f78fe425-6ca5-451b-9de3-e08e56a46f5d	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S25 est en retard.	/mes-taches	f	\N	ef2afd20-3330-49b9-8526-2d0c14be549d	2026-07-20 09:19:08.536146
e2275c63-1290-4d17-83df-9f3911411eee	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S25) est en retard.	/mes-taches	f	\N	ef2afd20-3330-49b9-8526-2d0c14be549d	2026-07-20 09:19:08.540028
8b18d1c4-1614-4aba-85e1-bef1949c4a3d	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S26 est en retard.	/mes-taches	f	\N	fa9983da-12ec-498d-b859-0642828844dd	2026-07-20 09:19:08.543287
23e2ab73-8d63-47e3-b5d4-9114d0fada3d	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S26) est en retard.	/mes-taches	f	\N	fa9983da-12ec-498d-b859-0642828844dd	2026-07-20 09:19:08.546722
ea9089b0-31cd-433a-9da7-ac25910a6028	bdd9c427-20ec-4456-bc3d-91c23859a150	INSPECTION_CREEE	Inspection créée	Votre inspection Cantine sur le site Sousse a été créée. Commencez à remplir la checklist.	/inspections/391289c8-3969-41c9-8301-53cc59870dfe	f	\N	391289c8-3969-41c9-8301-53cc59870dfe	2026-07-20 09:21:19.259628
8ae6af3f-8fea-4b51-8eca-02f2608deccd	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S29 est en retard.	/mes-taches	f	\N	5e8ed279-980f-415b-a474-d926f99d78a4	2026-07-20 09:36:42.040983
15512fc2-f0d2-4e54-a8f2-d56353f10edc	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S29) est en retard.	/mes-taches	f	\N	5e8ed279-980f-415b-a474-d926f99d78a4	2026-07-20 09:36:42.088515
846f361d-2ae2-4676-9f23-24eb044d7dba	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Infirmerie prévue pour la semaine S27 est en retard.	/mes-taches	f	\N	fef5b0ce-7bec-4d78-8cdb-550ec934e666	2026-07-20 09:36:42.093561
76819c14-8697-4057-a647-c6a5237bab32	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Infirmerie (Semaine S27) est en retard.	/mes-taches	f	\N	fef5b0ce-7bec-4d78-8cdb-550ec934e666	2026-07-20 09:36:42.132639
fc5b1727-2341-4b58-82fa-f8655ed8e351	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S27 est en retard.	/mes-taches	f	\N	10f3ea3c-ac1d-4e6b-95a6-ddd40bcdfaf5	2026-07-20 09:36:42.138905
c15424f6-4c98-4256-bf2d-946e935d9d8c	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S27) est en retard.	/mes-taches	f	\N	10f3ea3c-ac1d-4e6b-95a6-ddd40bcdfaf5	2026-07-20 09:36:42.145196
8f372e8e-98e1-46c6-aee2-68d8bfcf97a2	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S5 est en retard.	/mes-taches	f	\N	67205465-c5f8-4fc5-b05d-6e68edb6db30	2026-07-20 09:36:42.150162
4a36041c-8408-405f-ae94-70c99c61b922	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S5) est en retard.	/mes-taches	f	\N	67205465-c5f8-4fc5-b05d-6e68edb6db30	2026-07-20 09:36:42.154599
e97e44b2-9bb4-4761-8b55-dc8c5fe11a55	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S6 est en retard.	/mes-taches	f	\N	1f50f95c-e498-45fe-bf8c-0724cf002b47	2026-07-20 09:36:42.160415
f1802ddd-9728-4216-a1b3-e0f09cd35a67	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S6) est en retard.	/mes-taches	f	\N	1f50f95c-e498-45fe-bf8c-0724cf002b47	2026-07-20 09:36:42.165484
66da41cd-dff1-417f-bb21-eb31d337b25e	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S7 est en retard.	/mes-taches	f	\N	2ff5ff74-96e8-41e1-a4ee-3b0fbbd37a02	2026-07-20 09:36:42.170785
7b889214-2911-4230-9f4e-0a41f440972a	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S7) est en retard.	/mes-taches	f	\N	2ff5ff74-96e8-41e1-a4ee-3b0fbbd37a02	2026-07-20 09:36:42.176646
38bc22d0-ffb8-467a-b515-f54c08ac1da7	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S24) est en retard.	/mes-taches	f	\N	f46b584c-5809-420d-9cdd-851b1745135a	2026-07-20 09:36:42.405091
bc777aa8-8f9c-4dd8-91a7-8c3d9ab4a132	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S8 est en retard.	/mes-taches	f	\N	27ca5fe5-8373-442d-93ec-5c2ec24a5cd2	2026-07-20 09:36:42.183554
33b052cd-6064-4d51-aa96-7206609d3588	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S8) est en retard.	/mes-taches	f	\N	27ca5fe5-8373-442d-93ec-5c2ec24a5cd2	2026-07-20 09:36:42.191771
2ef94831-8be0-4ff3-a878-fff85151364d	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S9 est en retard.	/mes-taches	f	\N	83263296-9905-41fc-95b0-f491e106ff76	2026-07-20 09:36:42.198844
b9e584a4-a7b7-4b80-98d9-413a0aae4d8c	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S9) est en retard.	/mes-taches	f	\N	83263296-9905-41fc-95b0-f491e106ff76	2026-07-20 09:36:42.204987
d90bbdb0-37ca-415b-8122-44c4b068209f	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S10 est en retard.	/mes-taches	f	\N	b4b492a8-e265-4e56-8e38-53c62a662387	2026-07-20 09:36:42.212196
b5b6042a-07b7-41dd-991c-9dea7ba5a308	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S10) est en retard.	/mes-taches	f	\N	b4b492a8-e265-4e56-8e38-53c62a662387	2026-07-20 09:36:42.217258
392e63c2-8b7e-4f82-8d61-aeb171011a59	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S11 est en retard.	/mes-taches	f	\N	b6c36a49-a20a-431a-a215-66e800fa008d	2026-07-20 09:36:42.222142
52e9ccdb-b0d2-4fdb-a319-17acb6fa6fe3	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S11) est en retard.	/mes-taches	f	\N	b6c36a49-a20a-431a-a215-66e800fa008d	2026-07-20 09:36:42.226537
29836c03-6d1d-4099-bec4-bc4b565afce8	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S12 est en retard.	/mes-taches	f	\N	715dd598-4606-4144-89e0-95e37e200cb4	2026-07-20 09:36:42.23058
43331a30-8d5a-4a1b-8bac-cbe09defffad	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S12) est en retard.	/mes-taches	f	\N	715dd598-4606-4144-89e0-95e37e200cb4	2026-07-20 09:36:42.234924
edcb6633-763c-43a5-adf9-213efa4ce911	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S13 est en retard.	/mes-taches	f	\N	aace607e-a533-4e7a-b028-0979a9048e24	2026-07-20 09:36:42.239353
4ed7e136-0da1-4470-88bc-c05450d474e5	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S13) est en retard.	/mes-taches	f	\N	aace607e-a533-4e7a-b028-0979a9048e24	2026-07-20 09:36:42.244514
cf408c95-6061-4ed4-9469-27a7cc45afce	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S28 est en retard.	/mes-taches	f	\N	05102cd2-6fd8-4012-9bcb-37f4f0493ec2	2026-07-20 09:36:42.24893
2af866c0-276c-4c58-bd20-3809c055c9b5	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S28) est en retard.	/mes-taches	f	\N	05102cd2-6fd8-4012-9bcb-37f4f0493ec2	2026-07-20 09:36:42.253157
4f98e8f5-a472-46b4-85a1-b298bbfe0bef	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S14 est en retard.	/mes-taches	f	\N	79df8789-64d5-4ae6-86d5-a8db931280e5	2026-07-20 09:36:42.257479
b944d076-d295-4438-845c-4b78d1b141fc	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S14) est en retard.	/mes-taches	f	\N	79df8789-64d5-4ae6-86d5-a8db931280e5	2026-07-20 09:36:42.261395
91672986-1b51-40bc-9ced-8108ebb01113	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S15 est en retard.	/mes-taches	f	\N	02630876-54e9-4d05-9650-63ce89037779	2026-07-20 09:36:42.264825
035cae3b-c510-482d-966d-1b4db7bb9d7d	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S15) est en retard.	/mes-taches	f	\N	02630876-54e9-4d05-9650-63ce89037779	2026-07-20 09:36:42.269053
afa635c0-2c12-49dc-900c-7eeaf2cffd85	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S16 est en retard.	/mes-taches	f	\N	80fab3c2-020d-4fd4-88c2-fabd36676055	2026-07-20 09:36:42.273047
9434429a-46ee-4c6b-b2a1-5baaf0f32c3f	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S16) est en retard.	/mes-taches	f	\N	80fab3c2-020d-4fd4-88c2-fabd36676055	2026-07-20 09:36:42.279809
310e636f-2b55-4045-99f8-6f5dcba1856f	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S17 est en retard.	/mes-taches	f	\N	581038bd-54ab-4048-81d9-753997345154	2026-07-20 09:36:42.284341
2f08a7c2-03be-4b2e-b266-85058eb12238	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S17) est en retard.	/mes-taches	f	\N	581038bd-54ab-4048-81d9-753997345154	2026-07-20 09:36:42.321791
84a8bbc4-344a-4df0-9ce2-74c11e984196	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S18 est en retard.	/mes-taches	f	\N	81dc25ce-bb8a-4193-ad2a-3fbe5e0163db	2026-07-20 09:36:42.32642
8c630f02-c54f-48cf-a65a-8727f9904525	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S18) est en retard.	/mes-taches	f	\N	81dc25ce-bb8a-4193-ad2a-3fbe5e0163db	2026-07-20 09:36:42.330786
bf9e7627-5096-49c8-841d-0bf9cee20018	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S19 est en retard.	/mes-taches	f	\N	c0c66aed-7cdb-4578-80a3-dcc73be9ccd6	2026-07-20 09:36:42.335092
9edb0d00-e9e6-4f95-9c52-f079684fe9f6	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S19) est en retard.	/mes-taches	f	\N	c0c66aed-7cdb-4578-80a3-dcc73be9ccd6	2026-07-20 09:36:42.339095
e9a28bb6-df6b-4691-bdae-a5c8cc318234	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S20 est en retard.	/mes-taches	f	\N	d8f7380f-2b3e-4a2a-a5a7-af860f1b343c	2026-07-20 09:36:42.34343
65b503f6-14c1-46a1-b751-abf370923cb7	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S20) est en retard.	/mes-taches	f	\N	d8f7380f-2b3e-4a2a-a5a7-af860f1b343c	2026-07-20 09:36:42.350928
5a95e817-02d4-4dea-bcbe-2c5af42b1a3b	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S21 est en retard.	/mes-taches	f	\N	aa647e0d-0e5f-4d8a-852b-9afbf0340d1c	2026-07-20 09:36:42.355909
fc386aef-464c-4751-bff3-68e0ccc775eb	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S21) est en retard.	/mes-taches	f	\N	aa647e0d-0e5f-4d8a-852b-9afbf0340d1c	2026-07-20 09:36:42.360411
003cc7ae-4051-4284-94b4-6af6729cc92c	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S22 est en retard.	/mes-taches	f	\N	4dbf96c0-938b-4f1a-9678-59d693c0e290	2026-07-20 09:36:42.369447
6ba2ee48-813f-4690-aab3-9b52b916c238	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S22) est en retard.	/mes-taches	f	\N	4dbf96c0-938b-4f1a-9678-59d693c0e290	2026-07-20 09:36:42.384104
b37d61d0-e4fb-40c2-8a53-f8bc0994cfb1	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S23 est en retard.	/mes-taches	f	\N	197bae46-2951-4796-909c-16a38cf5eb30	2026-07-20 09:36:42.391825
76dca985-9fde-4186-866a-bc6c9e2bf8e8	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S23) est en retard.	/mes-taches	f	\N	197bae46-2951-4796-909c-16a38cf5eb30	2026-07-20 09:36:42.39628
a4a59a84-a989-4c2d-bb56-43e9ad2e1094	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S24 est en retard.	/mes-taches	f	\N	f46b584c-5809-420d-9cdd-851b1745135a	2026-07-20 09:36:42.400709
c17bab7d-ec9e-42fa-a587-be1e14b5ea34	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S25 est en retard.	/mes-taches	f	\N	ef2afd20-3330-49b9-8526-2d0c14be549d	2026-07-20 09:36:42.409009
668b63f1-9084-4754-980d-06c037c52d7a	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S25) est en retard.	/mes-taches	f	\N	ef2afd20-3330-49b9-8526-2d0c14be549d	2026-07-20 09:36:42.415706
14ac3656-b66d-44ed-89a8-e3c57341c722	bdd9c427-20ec-4456-bc3d-91c23859a150	PLAN_EN_RETARD	⚠️ Inspection en retard	L'inspection du domaine Cantine prévue pour la semaine S26 est en retard.	/mes-taches	f	\N	fa9983da-12ec-498d-b859-0642828844dd	2026-07-20 09:36:42.421173
5a832c48-7e58-4068-814a-5122558deb26	fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	PLAN_EN_RETARD	🚨 [ADMIN] Inspection en retard	L'inspection du domaine Cantine (Semaine S26) est en retard.	/mes-taches	f	\N	fa9983da-12ec-498d-b859-0642828844dd	2026-07-20 09:36:42.425187
d088b6d8-bc39-4501-8bc1-4895ba271eb7	bdd9c427-20ec-4456-bc3d-91c23859a150	INSPECTION_CLOTUREE	✅ Inspection clôturée	Votre inspection Cantine sur Menzel Hayet a été clôturée avec succès.	/inspections/87e79e77-8da0-4dd4-8326-d73ac69defb8	f	\N	87e79e77-8da0-4dd4-8326-d73ac69defb8	2026-07-20 09:37:13.308855
6cf35fee-8f67-4e84-83d2-24619298205a	bdd9c427-20ec-4456-bc3d-91c23859a150	INSPECTION_CREEE	Inspection créée	Votre inspection Cantine sur le site Sousse a été créée. Commencez à remplir la checklist.	/inspections/0ada7529-9504-43b4-bfe7-a23095d6ddda	f	\N	0ada7529-9504-43b4-bfe7-a23095d6ddda	2026-07-20 09:38:07.935095
508c990d-fe62-4e92-aedd-5adc3cddbb5b	bdd9c427-20ec-4456-bc3d-91c23859a150	INSPECTION_CREEE	Inspection créée	Votre inspection Cantine sur le site Sousse a été créée. Commencez à remplir la checklist.	/inspections/af0086cb-6371-418c-81da-373d0e460e9c	f	\N	af0086cb-6371-418c-81da-373d0e460e9c	2026-07-20 09:38:32.597153
13ecdd04-4456-431c-a30d-d270b9c27e6b	bdd9c427-20ec-4456-bc3d-91c23859a150	INSPECTION_CREEE	Inspection créée	Votre inspection Cantine sur le site Sousse a été créée. Commencez à remplir la checklist.	/inspections/bc336ab5-fb4c-4e6c-a0d6-1b4736ae282f	f	\N	bc336ab5-fb4c-4e6c-a0d6-1b4736ae282f	2026-07-20 09:39:19.441275
\.


--
-- Data for Name: plan_surveillance; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.plan_surveillance (id, semaine, annee, domaine, frequence, statut, site, "dateDebut", "dateFin", "inspectionId", "responsableId", commentaire, "autoGenere", "createdAt", "updatedAt") FROM stdin;
073fc1e1-1345-449f-a226-90048aa46117	31	2026	Infirmerie	MENSUEL	PLANIFIE	Sousse	2026-07-27	2026-08-02	\N	bdd9c427-20ec-4456-bc3d-91c23859a150	\N	f	2026-06-29 08:38:08.054344	2026-06-29 08:38:08.054344
707f96a9-e789-4ff8-9fcb-e216cb3856ef	35	2026	Infirmerie	MENSUEL	PLANIFIE	Sousse	2026-08-24	2026-08-30	\N	bdd9c427-20ec-4456-bc3d-91c23859a150	\N	f	2026-06-29 08:38:08.057975	2026-06-29 08:38:08.057975
4fbdbcbb-6f44-4c90-a169-6a882a43b720	39	2026	Infirmerie	MENSUEL	PLANIFIE	Sousse	2026-09-21	2026-09-27	\N	bdd9c427-20ec-4456-bc3d-91c23859a150	\N	f	2026-06-29 08:38:08.061445	2026-06-29 08:38:08.061445
5dfc5e1d-3096-49ca-b540-00d9b99a7520	43	2026	Infirmerie	MENSUEL	PLANIFIE	Sousse	2026-10-19	2026-10-25	\N	bdd9c427-20ec-4456-bc3d-91c23859a150	\N	f	2026-06-29 08:38:08.066986	2026-06-29 08:38:08.066986
436d4bed-593b-4bcf-86e2-e8305d023009	47	2026	Infirmerie	MENSUEL	PLANIFIE	Sousse	2026-11-16	2026-11-22	\N	bdd9c427-20ec-4456-bc3d-91c23859a150	\N	f	2026-06-29 08:38:08.070686	2026-06-29 08:38:08.070686
f242e2b1-1f65-428f-91a2-4237d733a2e0	51	2026	Infirmerie	MENSUEL	PLANIFIE	Sousse	2026-12-14	2026-12-20	\N	bdd9c427-20ec-4456-bc3d-91c23859a150	\N	f	2026-06-29 08:38:08.074727	2026-06-29 08:38:08.074727
67205465-c5f8-4fc5-b05d-6e68edb6db30	5	2026	Cantine	HEBDOMADAIRE	EN_COURS	Sousse	2026-01-26	2026-02-01	0ada7529-9504-43b4-bfe7-a23095d6ddda	bdd9c427-20ec-4456-bc3d-91c23859a150	\N	f	2026-06-29 09:24:29.776788	2026-07-20 09:38:07.924665
1f50f95c-e498-45fe-bf8c-0724cf002b47	6	2026	Cantine	HEBDOMADAIRE	EN_COURS	Sousse	2026-02-02	2026-02-08	bc336ab5-fb4c-4e6c-a0d6-1b4736ae282f	bdd9c427-20ec-4456-bc3d-91c23859a150	\N	f	2026-06-29 09:24:29.831311	2026-07-20 09:39:19.437537
f25fdf69-55ca-4997-8475-9abd1de913c9	30	2026	Cantine	HEBDOMADAIRE	EN_COURS	Sousse	2026-07-20	2026-07-26	391289c8-3969-41c9-8301-53cc59870dfe	bdd9c427-20ec-4456-bc3d-91c23859a150	\N	f	2026-06-29 09:24:29.950245	2026-07-20 09:21:19.251991
5e8ed279-980f-415b-a474-d926f99d78a4	29	2026	Cantine	HEBDOMADAIRE	EN_RETARD	Sousse	2026-07-13	2026-07-19	\N	bdd9c427-20ec-4456-bc3d-91c23859a150	\N	f	2026-06-29 09:24:29.945917	2026-07-20 09:36:42.014401
3ca6a4d4-4cc1-41c4-a686-faa324179b6f	31	2026	Cantine	HEBDOMADAIRE	PLANIFIE	Sousse	2026-07-27	2026-08-02	\N	bdd9c427-20ec-4456-bc3d-91c23859a150	\N	f	2026-06-29 09:24:29.954712	2026-06-29 09:24:29.954712
20cb91ae-2cd0-4ab2-9c92-b5caf9f8da6b	32	2026	Cantine	HEBDOMADAIRE	PLANIFIE	Sousse	2026-08-03	2026-08-09	\N	bdd9c427-20ec-4456-bc3d-91c23859a150	\N	f	2026-06-29 09:24:29.958451	2026-06-29 09:24:29.958451
621f9f28-e926-41c0-9537-c89249ad2966	33	2026	Cantine	HEBDOMADAIRE	PLANIFIE	Sousse	2026-08-10	2026-08-16	\N	bdd9c427-20ec-4456-bc3d-91c23859a150	\N	f	2026-06-29 09:24:29.962354	2026-06-29 09:24:29.962354
ed558040-d3d7-4a12-a9e7-6335aeb43e78	34	2026	Cantine	HEBDOMADAIRE	PLANIFIE	Sousse	2026-08-17	2026-08-23	\N	bdd9c427-20ec-4456-bc3d-91c23859a150	\N	f	2026-06-29 09:24:29.968	2026-06-29 09:24:29.968
c623812a-3e3b-4a24-848b-91e03887be3b	35	2026	Cantine	HEBDOMADAIRE	PLANIFIE	Sousse	2026-08-24	2026-08-30	\N	bdd9c427-20ec-4456-bc3d-91c23859a150	\N	f	2026-06-29 09:24:29.972565	2026-06-29 09:24:29.972565
7d1876cd-b5d7-4170-b354-151bb6a4cd56	36	2026	Cantine	HEBDOMADAIRE	PLANIFIE	Sousse	2026-08-31	2026-09-06	\N	bdd9c427-20ec-4456-bc3d-91c23859a150	\N	f	2026-06-29 09:24:29.976528	2026-06-29 09:24:29.976528
b4ba7eda-6f18-4ee2-833a-61195f2091e4	37	2026	Cantine	HEBDOMADAIRE	PLANIFIE	Sousse	2026-09-07	2026-09-13	\N	bdd9c427-20ec-4456-bc3d-91c23859a150	\N	f	2026-06-29 09:24:29.980347	2026-06-29 09:24:29.980347
5a07e73e-d77f-47bb-87f1-98df193b9058	38	2026	Cantine	HEBDOMADAIRE	PLANIFIE	Sousse	2026-09-14	2026-09-20	\N	bdd9c427-20ec-4456-bc3d-91c23859a150	\N	f	2026-06-29 09:24:29.986481	2026-06-29 09:24:29.986481
093414cd-a970-4c02-b3be-bc70bbea61fb	39	2026	Cantine	HEBDOMADAIRE	PLANIFIE	Sousse	2026-09-21	2026-09-27	\N	bdd9c427-20ec-4456-bc3d-91c23859a150	\N	f	2026-06-29 09:24:29.990467	2026-06-29 09:24:29.990467
241bb3c7-550e-4f7f-9c43-690e5e4d9c09	40	2026	Cantine	HEBDOMADAIRE	PLANIFIE	Sousse	2026-09-28	2026-10-04	\N	bdd9c427-20ec-4456-bc3d-91c23859a150	\N	f	2026-06-29 09:24:29.994943	2026-06-29 09:24:29.994943
33592d03-3045-481a-9f7b-b0b8528c6bc3	41	2026	Cantine	HEBDOMADAIRE	PLANIFIE	Sousse	2026-10-05	2026-10-11	\N	bdd9c427-20ec-4456-bc3d-91c23859a150	\N	f	2026-06-29 09:24:29.999087	2026-06-29 09:24:29.999087
e4c4247d-f844-4765-9ad9-9b00d2f4e76c	42	2026	Cantine	HEBDOMADAIRE	PLANIFIE	Sousse	2026-10-12	2026-10-18	\N	bdd9c427-20ec-4456-bc3d-91c23859a150	\N	f	2026-06-29 09:24:30.003921	2026-06-29 09:24:30.003921
0199e237-edad-4570-96cd-59c3f75e7d4c	43	2026	Cantine	HEBDOMADAIRE	PLANIFIE	Sousse	2026-10-19	2026-10-25	\N	bdd9c427-20ec-4456-bc3d-91c23859a150	\N	f	2026-06-29 09:24:30.008405	2026-06-29 09:24:30.008405
8e1c0732-a801-4ba5-b7dc-ecbb291a3d85	44	2026	Cantine	HEBDOMADAIRE	PLANIFIE	Sousse	2026-10-26	2026-11-01	\N	bdd9c427-20ec-4456-bc3d-91c23859a150	\N	f	2026-06-29 09:24:30.011987	2026-06-29 09:24:30.011987
3251ef8e-0208-4b9b-ab6f-cada2a91b93b	45	2026	Cantine	HEBDOMADAIRE	PLANIFIE	Sousse	2026-11-02	2026-11-08	\N	bdd9c427-20ec-4456-bc3d-91c23859a150	\N	f	2026-06-29 09:24:30.017612	2026-06-29 09:24:30.017612
841dd110-d639-490f-b9b8-119decf391cb	46	2026	Cantine	HEBDOMADAIRE	PLANIFIE	Sousse	2026-11-09	2026-11-15	\N	bdd9c427-20ec-4456-bc3d-91c23859a150	\N	f	2026-06-29 09:24:30.021807	2026-06-29 09:24:30.021807
4d11406a-a650-464f-aae0-167efa8138f3	47	2026	Cantine	HEBDOMADAIRE	PLANIFIE	Sousse	2026-11-16	2026-11-22	\N	bdd9c427-20ec-4456-bc3d-91c23859a150	\N	f	2026-06-29 09:24:30.025726	2026-06-29 09:24:30.025726
6d0b1dd4-4f9e-402d-9010-6634e8645a2d	48	2026	Cantine	HEBDOMADAIRE	PLANIFIE	Sousse	2026-11-23	2026-11-29	\N	bdd9c427-20ec-4456-bc3d-91c23859a150	\N	f	2026-06-29 09:24:30.029134	2026-06-29 09:24:30.029134
0fafa315-5e1d-47e3-a9ce-33816484d95f	49	2026	Cantine	HEBDOMADAIRE	PLANIFIE	Sousse	2026-11-30	2026-12-06	\N	bdd9c427-20ec-4456-bc3d-91c23859a150	\N	f	2026-06-29 09:24:30.034581	2026-06-29 09:24:30.034581
9d91cd2d-82d7-47fc-919a-2a9c54b8d7f9	50	2026	Cantine	HEBDOMADAIRE	PLANIFIE	Sousse	2026-12-07	2026-12-13	\N	bdd9c427-20ec-4456-bc3d-91c23859a150	\N	f	2026-06-29 09:24:30.038373	2026-06-29 09:24:30.038373
c5220359-7a41-4044-a0fb-8b0b101791a7	51	2026	Cantine	HEBDOMADAIRE	PLANIFIE	Sousse	2026-12-14	2026-12-20	\N	bdd9c427-20ec-4456-bc3d-91c23859a150	\N	f	2026-06-29 09:24:30.041874	2026-06-29 09:24:30.041874
554fd733-7adb-46e7-a198-a3b679c1414c	52	2026	Cantine	HEBDOMADAIRE	PLANIFIE	Sousse	2026-12-21	2026-12-27	\N	bdd9c427-20ec-4456-bc3d-91c23859a150	\N	f	2026-06-29 09:24:30.04562	2026-06-29 09:24:30.04562
fef5b0ce-7bec-4d78-8cdb-550ec934e666	27	2026	Infirmerie	MENSUEL	EN_RETARD	Sousse	2026-06-29	2026-07-05	\N	bdd9c427-20ec-4456-bc3d-91c23859a150	\N	f	2026-06-29 08:38:08.044584	2026-07-20 09:36:42.014401
10f3ea3c-ac1d-4e6b-95a6-ddd40bcdfaf5	27	2026	Cantine	HEBDOMADAIRE	EN_RETARD	Sousse	2026-06-29	2026-07-05	\N	bdd9c427-20ec-4456-bc3d-91c23859a150	\N	f	2026-06-29 09:24:29.938054	2026-07-20 09:36:42.014401
2ff5ff74-96e8-41e1-a4ee-3b0fbbd37a02	7	2026	Cantine	HEBDOMADAIRE	EN_RETARD	Sousse	2026-02-09	2026-02-15	\N	bdd9c427-20ec-4456-bc3d-91c23859a150	\N	f	2026-06-29 09:24:29.837776	2026-07-20 09:36:42.014401
27ca5fe5-8373-442d-93ec-5c2ec24a5cd2	8	2026	Cantine	HEBDOMADAIRE	EN_RETARD	Sousse	2026-02-16	2026-02-22	\N	bdd9c427-20ec-4456-bc3d-91c23859a150	\N	f	2026-06-29 09:24:29.843071	2026-07-20 09:36:42.014401
83263296-9905-41fc-95b0-f491e106ff76	9	2026	Cantine	HEBDOMADAIRE	EN_RETARD	Sousse	2026-02-23	2026-03-01	\N	bdd9c427-20ec-4456-bc3d-91c23859a150	\N	f	2026-06-29 09:24:29.847029	2026-07-20 09:36:42.014401
b4b492a8-e265-4e56-8e38-53c62a662387	10	2026	Cantine	HEBDOMADAIRE	EN_RETARD	Sousse	2026-03-02	2026-03-08	\N	bdd9c427-20ec-4456-bc3d-91c23859a150	\N	f	2026-06-29 09:24:29.853737	2026-07-20 09:36:42.014401
b6c36a49-a20a-431a-a215-66e800fa008d	11	2026	Cantine	HEBDOMADAIRE	EN_RETARD	Sousse	2026-03-09	2026-03-15	\N	bdd9c427-20ec-4456-bc3d-91c23859a150	\N	f	2026-06-29 09:24:29.860257	2026-07-20 09:36:42.014401
715dd598-4606-4144-89e0-95e37e200cb4	12	2026	Cantine	HEBDOMADAIRE	EN_RETARD	Sousse	2026-03-16	2026-03-22	\N	bdd9c427-20ec-4456-bc3d-91c23859a150	\N	f	2026-06-29 09:24:29.864903	2026-07-20 09:36:42.014401
aace607e-a533-4e7a-b028-0979a9048e24	13	2026	Cantine	HEBDOMADAIRE	EN_RETARD	Sousse	2026-03-23	2026-03-29	\N	bdd9c427-20ec-4456-bc3d-91c23859a150	\N	f	2026-06-29 09:24:29.870499	2026-07-20 09:36:42.014401
05102cd2-6fd8-4012-9bcb-37f4f0493ec2	28	2026	Cantine	HEBDOMADAIRE	EN_RETARD	Sousse	2026-07-06	2026-07-12	\N	bdd9c427-20ec-4456-bc3d-91c23859a150	\N	f	2026-06-29 09:24:29.94247	2026-07-20 09:36:42.014401
79df8789-64d5-4ae6-86d5-a8db931280e5	14	2026	Cantine	HEBDOMADAIRE	EN_RETARD	Sousse	2026-03-30	2026-04-05	\N	bdd9c427-20ec-4456-bc3d-91c23859a150	\N	f	2026-06-29 09:24:29.874782	2026-07-20 09:36:42.014401
02630876-54e9-4d05-9650-63ce89037779	15	2026	Cantine	HEBDOMADAIRE	EN_RETARD	Sousse	2026-04-06	2026-04-12	\N	bdd9c427-20ec-4456-bc3d-91c23859a150	\N	f	2026-06-29 09:24:29.879252	2026-07-20 09:36:42.014401
80fab3c2-020d-4fd4-88c2-fabd36676055	16	2026	Cantine	HEBDOMADAIRE	EN_RETARD	Sousse	2026-04-13	2026-04-19	\N	bdd9c427-20ec-4456-bc3d-91c23859a150	\N	f	2026-06-29 09:24:29.885845	2026-07-20 09:36:42.014401
581038bd-54ab-4048-81d9-753997345154	17	2026	Cantine	HEBDOMADAIRE	EN_RETARD	Sousse	2026-04-20	2026-04-26	\N	bdd9c427-20ec-4456-bc3d-91c23859a150	\N	f	2026-06-29 09:24:29.891099	2026-07-20 09:36:42.014401
81dc25ce-bb8a-4193-ad2a-3fbe5e0163db	18	2026	Cantine	HEBDOMADAIRE	EN_RETARD	Sousse	2026-04-27	2026-05-03	\N	bdd9c427-20ec-4456-bc3d-91c23859a150	\N	f	2026-06-29 09:24:29.895003	2026-07-20 09:36:42.014401
c0c66aed-7cdb-4578-80a3-dcc73be9ccd6	19	2026	Cantine	HEBDOMADAIRE	EN_RETARD	Sousse	2026-05-04	2026-05-10	\N	bdd9c427-20ec-4456-bc3d-91c23859a150	\N	f	2026-06-29 09:24:29.899376	2026-07-20 09:36:42.014401
d8f7380f-2b3e-4a2a-a5a7-af860f1b343c	20	2026	Cantine	HEBDOMADAIRE	EN_RETARD	Sousse	2026-05-11	2026-05-17	\N	bdd9c427-20ec-4456-bc3d-91c23859a150	\N	f	2026-06-29 09:24:29.905567	2026-07-20 09:36:42.014401
aa647e0d-0e5f-4d8a-852b-9afbf0340d1c	21	2026	Cantine	HEBDOMADAIRE	EN_RETARD	Sousse	2026-05-18	2026-05-24	\N	bdd9c427-20ec-4456-bc3d-91c23859a150	\N	f	2026-06-29 09:24:29.910215	2026-07-20 09:36:42.014401
4dbf96c0-938b-4f1a-9678-59d693c0e290	22	2026	Cantine	HEBDOMADAIRE	EN_RETARD	Sousse	2026-05-25	2026-05-31	\N	bdd9c427-20ec-4456-bc3d-91c23859a150	\N	f	2026-06-29 09:24:29.914944	2026-07-20 09:36:42.014401
197bae46-2951-4796-909c-16a38cf5eb30	23	2026	Cantine	HEBDOMADAIRE	EN_RETARD	Sousse	2026-06-01	2026-06-07	\N	bdd9c427-20ec-4456-bc3d-91c23859a150	\N	f	2026-06-29 09:24:29.920882	2026-07-20 09:36:42.014401
f46b584c-5809-420d-9cdd-851b1745135a	24	2026	Cantine	HEBDOMADAIRE	EN_RETARD	Sousse	2026-06-08	2026-06-14	\N	bdd9c427-20ec-4456-bc3d-91c23859a150	\N	f	2026-06-29 09:24:29.925198	2026-07-20 09:36:42.014401
ef2afd20-3330-49b9-8526-2d0c14be549d	25	2026	Cantine	HEBDOMADAIRE	EN_RETARD	Sousse	2026-06-15	2026-06-21	\N	bdd9c427-20ec-4456-bc3d-91c23859a150	\N	f	2026-06-29 09:24:29.92873	2026-07-20 09:36:42.014401
fa9983da-12ec-498d-b859-0642828844dd	26	2026	Cantine	HEBDOMADAIRE	EN_RETARD	Sousse	2026-06-22	2026-06-28	12c8b97d-f9b8-4ebd-a00c-e4c357017e26	bdd9c427-20ec-4456-bc3d-91c23859a150	\N	f	2026-06-29 09:24:29.932852	2026-07-20 09:36:42.014401
\.


--
-- Data for Name: regulatory_events; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.regulatory_events (id, type, titre, description, "datePrevue", "dateRealisation", statut, recurrence, responsable_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, "firstName", "lastName", email, password, role, "createdAt", "updatedAt", "resetPasswordToken", "resetPasswordExpires", status, "setPasswordToken", "setPasswordExpires", department) FROM stdin;
32a55cf3-875f-40be-8b78-a9bb335ee533	roua	HSEE	roua@leoni.com	$2b$12$iV7ag0HIKVDogiTBNMTgPeZcG/9Pg.lfq5Mk1et8wudzqSpj/pcYW	AUDITEUR	2026-06-16 12:21:19.501751	2026-06-16 12:30:34.331844	\N	\N	PENDING	\N	\N	\N
fe7cb8fa-ca3b-452a-9c22-352ab68f52c4	Admin	HSEE	admin@leoni.com	$2b$12$iRWPB3fIXXziTKy0xv8KYeKArjMGIDgR7jNXggRVUC3.N5ETJe2Fi	ADMIN_HSEE	2026-06-15 11:44:23.787915	2026-06-15 11:44:23.787915	\N	\N	ACTIVE	\N	\N	\N
12d562dd-592e-4bd4-b341-ca2a28369656	oumayma	HSEE	oumaymahadjmohamed@gmail.com	\N	AUDITEUR	2026-06-19 08:55:43.842503	2026-06-19 08:55:43.842503	\N	\N	PENDING	12682b16b6c099970f97197608bd89327b7820d29f4ee5cfda509985ea947d0f	2026-06-21 09:55:43.855	\N
bdd9c427-20ec-4456-bc3d-91c23859a150	tiba	roua	rouatiba95@gmail.com	$2b$12$cBPwrbaCZ2IDnYwcvM8qYetG1Lj/NSdWKa/cK7O3N5o5lN2ZDc71.	AUDITEUR	2026-06-24 11:41:36.200214	2026-06-24 11:42:05.491376	\N	\N	ACTIVE	\N	\N	RH
6f4e9c9e-5c7a-4676-8acb-8ff7f03664de	raoua	r	rouatiba2@gmail.com	$2b$12$xmVg9hQ/VK57fzUqtW6OYeGEPjMLAFxk/m3GXB2QZxykJr7AxHcFG	PILOTE_ACTION	2026-07-03 08:57:35.591111	2026-07-03 09:01:34.055303	\N	\N	ACTIVE	\N	\N	Maintenance
\.


--
-- Name: action_proofs PK_1e3848517e5cd4ade501fde30ed; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.action_proofs
    ADD CONSTRAINT "PK_1e3848517e5cd4ade501fde30ed" PRIMARY KEY (id);


--
-- Name: checklist_responses PK_56c49c0193886429e96281676a2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.checklist_responses
    ADD CONSTRAINT "PK_56c49c0193886429e96281676a2" PRIMARY KEY (id);


--
-- Name: anomaly_photos PK_5948f6a0115f9f23d091a05237d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.anomaly_photos
    ADD CONSTRAINT "PK_5948f6a0115f9f23d091a05237d" PRIMARY KEY (id);


--
-- Name: notifications PK_6a72c3c0f683f6462415e653c3a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY (id);


--
-- Name: action_comments PK_70c7f808eef0c9ee47a0ba51bf1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.action_comments
    ADD CONSTRAINT "PK_70c7f808eef0c9ee47a0ba51bf1" PRIMARY KEY (id);


--
-- Name: anomalies PK_85dc6428a06c59628d40b1c5f8e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.anomalies
    ADD CONSTRAINT "PK_85dc6428a06c59628d40b1c5f8e" PRIMARY KEY (id);


--
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- Name: inspections PK_a484980015782324454d8c88abe; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inspections
    ADD CONSTRAINT "PK_a484980015782324454d8c88abe" PRIMARY KEY (id);


--
-- Name: corrective_actions PK_b1382eccccc5ca8d821e3688ade; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.corrective_actions
    ADD CONSTRAINT "PK_b1382eccccc5ca8d821e3688ade" PRIMARY KEY (id);


--
-- Name: checklist_items PK_bae00945a1d4789bd648e583e29; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.checklist_items
    ADD CONSTRAINT "PK_bae00945a1d4789bd648e583e29" PRIMARY KEY (id);


--
-- Name: plan_surveillance PK_c3db2cf4adb471b2b2f2591da1a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plan_surveillance
    ADD CONSTRAINT "PK_c3db2cf4adb471b2b2f2591da1a" PRIMARY KEY (id);


--
-- Name: action_history PK_ca1fdf2edcf542ad46702522633; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.action_history
    ADD CONSTRAINT "PK_ca1fdf2edcf542ad46702522633" PRIMARY KEY (id);


--
-- Name: regulatory_events PK_d0660b33d574afc7e3193e25395; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.regulatory_events
    ADD CONSTRAINT "PK_d0660b33d574afc7e3193e25395" PRIMARY KEY (id);


--
-- Name: checklist_templates PK_e6d17651d110bbac45cf07e44fa; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.checklist_templates
    ADD CONSTRAINT "PK_e6d17651d110bbac45cf07e44fa" PRIMARY KEY (id);


--
-- Name: checklist_response_photos PK_ff1ae592ab5d8aa69127906111d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.checklist_response_photos
    ADD CONSTRAINT "PK_ff1ae592ab5d8aa69127906111d" PRIMARY KEY (id);


--
-- Name: corrective_actions REL_10eaf2d8274b75b30a42010d28; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.corrective_actions
    ADD CONSTRAINT "REL_10eaf2d8274b75b30a42010d28" UNIQUE (anomaly_id);


--
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- Name: IDX_09231e2f97ff6cfa6d88e62dc2; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_09231e2f97ff6cfa6d88e62dc2" ON public.notifications USING btree ("destinataireId", lu);


--
-- Name: IDX_b9fd8a5390ad991a7b2d422f3d; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_b9fd8a5390ad991a7b2d422f3d" ON public.plan_surveillance USING btree (annee, semaine, domaine);


--
-- Name: anomalies FK_0241e4cd9da5d4cc1180bdcf4c7; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.anomalies
    ADD CONSTRAINT "FK_0241e4cd9da5d4cc1180bdcf4c7" FOREIGN KEY (checklist_item_id) REFERENCES public.checklist_items(id) ON DELETE SET NULL;


--
-- Name: corrective_actions FK_10eaf2d8274b75b30a42010d28a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.corrective_actions
    ADD CONSTRAINT "FK_10eaf2d8274b75b30a42010d28a" FOREIGN KEY (anomaly_id) REFERENCES public.anomalies(id) ON DELETE CASCADE;


--
-- Name: action_comments FK_29fba6245877eb28924c7d71018; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.action_comments
    ADD CONSTRAINT "FK_29fba6245877eb28924c7d71018" FOREIGN KEY (author_id) REFERENCES public.users(id);


--
-- Name: corrective_actions FK_32883be9a2ea55f4fe8ef7d0bd5; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.corrective_actions
    ADD CONSTRAINT "FK_32883be9a2ea55f4fe8ef7d0bd5" FOREIGN KEY ("createdById") REFERENCES public.users(id);


--
-- Name: inspections FK_34d08ab8887b3ac2f7bf0647ba3; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inspections
    ADD CONSTRAINT "FK_34d08ab8887b3ac2f7bf0647ba3" FOREIGN KEY ("closedById") REFERENCES public.users(id);


--
-- Name: checklist_items FK_3b0803ad3ad82807b22dec08548; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.checklist_items
    ADD CONSTRAINT "FK_3b0803ad3ad82807b22dec08548" FOREIGN KEY (template_id) REFERENCES public.checklist_templates(id) ON DELETE CASCADE;


--
-- Name: plan_surveillance FK_3cb7a4b999d4b8e3d83f662e66a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plan_surveillance
    ADD CONSTRAINT "FK_3cb7a4b999d4b8e3d83f662e66a" FOREIGN KEY ("responsableId") REFERENCES public.users(id);


--
-- Name: action_proofs FK_4938922287f24996daefd0f317a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.action_proofs
    ADD CONSTRAINT "FK_4938922287f24996daefd0f317a" FOREIGN KEY (uploaded_by_id) REFERENCES public.users(id);


--
-- Name: checklist_response_photos FK_67f355d1b6c1d12bfb147b1b596; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.checklist_response_photos
    ADD CONSTRAINT "FK_67f355d1b6c1d12bfb147b1b596" FOREIGN KEY (response_id) REFERENCES public.checklist_responses(id) ON DELETE CASCADE;


--
-- Name: action_proofs FK_924ae8832dfdc072fbcab00cc51; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.action_proofs
    ADD CONSTRAINT "FK_924ae8832dfdc072fbcab00cc51" FOREIGN KEY (action_id) REFERENCES public.corrective_actions(id) ON DELETE CASCADE;


--
-- Name: inspections FK_984f2d5ae07aca61e99397dafd6; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inspections
    ADD CONSTRAINT "FK_984f2d5ae07aca61e99397dafd6" FOREIGN KEY ("auditeurId") REFERENCES public.users(id);


--
-- Name: corrective_actions FK_9e85c89271edbb27b8494df44dc; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.corrective_actions
    ADD CONSTRAINT "FK_9e85c89271edbb27b8494df44dc" FOREIGN KEY ("closedById") REFERENCES public.users(id);


--
-- Name: action_comments FK_a3d10fd3c63dbbd4c217f0ab9b2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.action_comments
    ADD CONSTRAINT "FK_a3d10fd3c63dbbd4c217f0ab9b2" FOREIGN KEY (action_id) REFERENCES public.corrective_actions(id) ON DELETE CASCADE;


--
-- Name: action_history FK_ae54a34102808c80064f867bcfa; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.action_history
    ADD CONSTRAINT "FK_ae54a34102808c80064f867bcfa" FOREIGN KEY ("changedById") REFERENCES public.users(id);


--
-- Name: checklist_responses FK_b27cf2a0df68be7154b9f4bbdd5; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.checklist_responses
    ADD CONSTRAINT "FK_b27cf2a0df68be7154b9f4bbdd5" FOREIGN KEY (item_id) REFERENCES public.checklist_items(id) ON DELETE CASCADE;


--
-- Name: anomaly_photos FK_b2a923a04facb16e90b408c0ed4; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.anomaly_photos
    ADD CONSTRAINT "FK_b2a923a04facb16e90b408c0ed4" FOREIGN KEY (anomaly_id) REFERENCES public.anomalies(id) ON DELETE CASCADE;


--
-- Name: notifications FK_e11c35f086b20d5bcf2f6a5e1bd; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "FK_e11c35f086b20d5bcf2f6a5e1bd" FOREIGN KEY ("destinataireId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: action_history FK_e72e1869bccd563c59c425c868d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.action_history
    ADD CONSTRAINT "FK_e72e1869bccd563c59c425c868d" FOREIGN KEY (action_id) REFERENCES public.corrective_actions(id) ON DELETE CASCADE;


--
-- Name: corrective_actions FK_f6318534e257fc9921a1c0b4694; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.corrective_actions
    ADD CONSTRAINT "FK_f6318534e257fc9921a1c0b4694" FOREIGN KEY ("piloteId") REFERENCES public.users(id);


--
-- Name: anomalies FK_fcd114a688bcfd5e94e546f9e91; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.anomalies
    ADD CONSTRAINT "FK_fcd114a688bcfd5e94e546f9e91" FOREIGN KEY ("createdById") REFERENCES public.users(id);


--
-- Name: regulatory_events FK_fce6291444152fda84a983d65c7; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.regulatory_events
    ADD CONSTRAINT "FK_fce6291444152fda84a983d65c7" FOREIGN KEY (responsable_id) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict eLfOfraffsNahXgA4VoupZ9dGG0oDkR0oSjVf10sir1urlpmMMgOl5ojupge7d0

