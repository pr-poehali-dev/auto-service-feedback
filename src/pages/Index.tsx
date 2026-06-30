import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

const LEAD_URL = 'https://functions.poehali.dev/82db012d-128a-4cd5-b059-928fd5115f6d';

const HERO_IMG =
  'https://cdn.poehali.dev/projects/e21ce7c1-2ef2-434f-b883-c9e47a6bd6c8/files/1dea9756-6758-4e1b-a53c-8552c77823dd.jpg';

const PHONE = '+7 919 208-10-01';
const PHONE_HREF = 'tel:+79192081001';
const TG = '@AutoVodAuto';
const TG_HREF = 'https://t.me/AutoVodAuto';
const MAIL = 'vodautovod@mail.ru';

const services = [
  {
    icon: 'UserCheck',
    title: 'Трезвый водитель',
    text: 'Доставим вас и ваш автомобиль домой в любое время суток. Безопасно, аккуратно, конфиденциально.',
    color: 'primary',
  },
  {
    icon: 'PartyPopper',
    title: 'Аренда авто для праздников',
    text: 'Эффектные авто на свадьбу, юбилей или фотосессию. Сделаем ваш праздник по-настоящему запоминающимся.',
    color: 'secondary',
  },
];

const prices = [
  { name: 'Трезвый водитель по городу', price: 'от 800 ₽', note: 'в пределах Ульяновска' },
  { name: 'Трезвый водитель за город', price: 'от 25 ₽/км', note: 'по области' },
  { name: 'Аренда авто на праздник', price: 'от 3 000 ₽', note: 'за час с водителем' },
  { name: 'Свадебный кортеж', price: 'договорная', note: 'индивидуальный расчёт' },
];

const nav = [
  { id: 'services', label: 'Услуги' },
  { id: 'prices', label: 'Цены' },
  { id: 'feedback', label: 'Обратная связь' },
  { id: 'contacts', label: 'Контакты' },
];

export default function Index() {
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [sending, setSending] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const submitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() && !form.phone.trim()) {
      toast({ title: 'Заполните имя или телефон', variant: 'destructive' });
      return;
    }
    setSending(true);
    try {
      const res = await fetch(LEAD_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.ok) {
        toast({ title: 'Заявка отправлена!', description: 'Мы свяжемся с вами в ближайшее время.' });
        setForm({ name: '', phone: '', message: '' });
      } else {
        toast({
          title: 'Не удалось отправить',
          description: data.error || 'Позвоните нам по телефону.',
          variant: 'destructive',
        });
      }
    } catch {
      toast({ title: 'Ошибка сети', description: 'Попробуйте позвонить нам.', variant: 'destructive' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <button
            onClick={() => scrollTo('hero')}
            className="flex items-center gap-2 font-display font-bold text-lg tracking-wide"
          >
            <span className="grid place-items-center w-9 h-9 rounded-lg bg-primary text-primary-foreground">
              <Icon name="Car" size={20} />
            </span>
            <span>AutoVod</span>
          </button>
          <nav className="hidden md:flex items-center gap-7">
            {nav.map((n) => (
              <button
                key={n.id}
                onClick={() => scrollTo(n.id)}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {n.label}
              </button>
            ))}
          </nav>
          <a href={PHONE_HREF}>
            <Button size="sm" className="font-semibold">
              <Icon name="Phone" size={16} className="mr-1.5" />
              Позвонить
            </Button>
          </a>
        </div>
      </header>

      {/* Hero */}
      <section id="hero" className="relative min-h-screen flex items-center pt-16">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="Ночная дорога" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
          <div className="absolute inset-0 grain opacity-60" />
        </div>

        <div className="container relative z-10 py-20">
          <div className="max-w-2xl animate-fade-in">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/40 text-primary text-sm mb-6 neon-border">
              <span className="w-2 h-2 rounded-full bg-primary animate-glow-pulse" />
              Ульяновск и область • 24/7
            </span>
            <p className="font-display italic text-accent text-xl sm:text-2xl mb-5 leading-snug">
              «Один звонок — и путь открыт,<br />трезвый водитель вас домчит»
            </p>
            <h1 className="font-display font-bold uppercase leading-[0.95] tracking-tight text-5xl sm:text-6xl lg:text-7xl mb-6">
              Трезвый водитель
              <br />
              <span className="text-primary text-glow">и авто на праздник</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mb-9">
              Доставим вас и ваш автомобиль домой в целости. Подберём эффектное авто
              для свадьбы, юбилея и любого торжества.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href={PHONE_HREF}>
                <Button size="lg" className="font-semibold text-base h-13 px-7">
                  <Icon name="Phone" size={18} className="mr-2" />
                  {PHONE}
                </Button>
              </a>
              <Button
                size="lg"
                variant="outline"
                className="font-semibold text-base h-13 px-7 border-primary/40 hover:bg-primary/10"
                onClick={() => scrollTo('feedback')}
              >
                Оставить заявку
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-24 relative">
        <div className="container">
          <SectionTitle kicker="Что мы делаем" title="Наши услуги" />
          <div className="grid md:grid-cols-2 gap-6 mt-12">
            {services.map((s) => (
              <div
                key={s.title}
                className="group relative p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all hover:-translate-y-1"
              >
                <div
                  className={`grid place-items-center w-14 h-14 rounded-xl mb-6 ${
                    s.color === 'primary'
                      ? 'bg-primary/15 text-primary'
                      : 'bg-secondary/20 text-secondary'
                  }`}
                >
                  <Icon name={s.icon} size={28} />
                </div>
                <h3 className="font-display font-semibold text-2xl mb-3">{s.title}</h3>
                <p className="text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prices */}
      <section id="prices" className="py-24 bg-muted/30 border-y border-border">
        <div className="container">
          <SectionTitle kicker="Стоимость" title="Цены" />
          <div className="max-w-3xl mx-auto mt-12 space-y-3">
            {prices.map((p) => (
              <div
                key={p.name}
                className="flex items-center justify-between gap-4 p-5 rounded-xl bg-card border border-border hover:border-primary/40 transition-colors"
              >
                <div>
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-sm text-muted-foreground">{p.note}</div>
                </div>
                <div className="font-display font-semibold text-xl text-primary whitespace-nowrap">
                  {p.price}
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-8">
            Точную стоимость уточняйте по телефону — рассчитаем под вашу задачу.
          </p>
        </div>
      </section>

      {/* Feedback */}
      <section id="feedback" className="py-24">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <SectionTitle kicker="Связаться с нами" title="Оставить заявку" />
            <form
              className="mt-12 space-y-4 p-8 rounded-2xl bg-card border border-border neon-border"
              onSubmit={submitLead}
            >
              <Input
                placeholder="Ваше имя"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="h-12 bg-background/60"
              />
              <Input
                placeholder="Телефон"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="h-12 bg-background/60"
              />
              <Textarea
                placeholder="Опишите задачу: услуга, дата, маршрут..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="min-h-28 bg-background/60"
              />
              <Button type="submit" size="lg" disabled={sending} className="w-full font-semibold h-12">
                {sending ? (
                  <>
                    <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
                    Отправляем...
                  </>
                ) : (
                  'Отправить заявку'
                )}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                По вопросам, жалобам и предложениям пишите на{' '}
                <a href={`mailto:${MAIL}`} className="text-primary">
                  {MAIL}
                </a>
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Contacts */}
      <section id="contacts" className="py-24 bg-muted/30 border-t border-border">
        <div className="container">
          <SectionTitle kicker="Мы на связи" title="Контакты" />
          <div className="grid sm:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
            <ContactCard icon="Phone" label="Телефон" value={PHONE} href={PHONE_HREF} />
            <ContactCard icon="Send" label="Telegram" value={TG} href={TG_HREF} />
            <ContactCard icon="Mail" label="Почта" value={MAIL} href={`mailto:${MAIL}`} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-border">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 font-display font-semibold text-foreground">
            <Icon name="Car" size={18} className="text-primary" />
            AutoVod • Ульяновск
          </div>
          <div>© {new Date().getFullYear()} Трезвый водитель и аренда авто</div>
        </div>
      </footer>
    </div>
  );
}

function SectionTitle({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="text-center">
      <span className="text-primary text-sm font-semibold uppercase tracking-[0.2em]">{kicker}</span>
      <h2 className="font-display font-bold uppercase text-4xl sm:text-5xl mt-3 tracking-tight">
        {title}
      </h2>
    </div>
  );
}

function ContactCard({
  icon,
  label,
  value,
  href,
}: {
  icon: string;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel="noreferrer"
      className="group flex flex-col items-center text-center gap-3 p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all hover:-translate-y-1"
    >
      <span className="grid place-items-center w-14 h-14 rounded-xl bg-primary/15 text-primary group-hover:scale-110 transition-transform">
        <Icon name={icon} size={26} />
      </span>
      <span className="text-sm text-muted-foreground uppercase tracking-wide">{label}</span>
      <span className="font-semibold text-foreground break-all">{value}</span>
    </a>
  );
}