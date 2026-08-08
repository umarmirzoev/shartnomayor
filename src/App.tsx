import { Routes, Route } from 'react-router-dom'
import PublicLayout from '@/layouts/PublicLayout'
import AppLayout from '@/layouts/AppLayout'

import Landing from '@/pages/Landing'
import NotFound from '@/pages/NotFound'
import Features from '@/pages/marketing/Features'
import HowItWorksPage from '@/pages/marketing/HowItWorks'
import TemplatesPage from '@/pages/marketing/Templates'
import PricingPage from '@/pages/marketing/Pricing'
import FaqPage from '@/pages/marketing/Faq'

import Login from '@/pages/app/Login'
import Dashboard from '@/pages/app/Dashboard'
import Clients from '@/pages/app/Clients'
import ClientDetail from '@/pages/app/ClientDetail'
import Cases from '@/pages/app/Cases'
import CaseDetail from '@/pages/app/CaseDetail'
import DraftNew from '@/pages/app/DraftNew'
import DraftEditor from '@/pages/app/DraftEditor'
import Templates from '@/pages/app/Templates'
import Alerts from '@/pages/app/Alerts'
import Settings from '@/pages/app/Settings'

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/features" element={<Features />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/templates" element={<TemplatesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/faq" element={<FaqPage />} />
      </Route>

      <Route path="/app/login" element={<Login />} />

      <Route path="/app" element={<AppLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="clients" element={<Clients />} />
        <Route path="clients/:id" element={<ClientDetail />} />
        <Route path="cases" element={<Cases />} />
        <Route path="cases/:id" element={<CaseDetail />} />
        <Route path="drafts/new" element={<DraftNew />} />
        <Route path="drafts/:id" element={<DraftEditor />} />
        <Route path="templates" element={<Templates />} />
        <Route path="alerts" element={<Alerts />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
