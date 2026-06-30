import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

const LEAD_URL = 'https://functions.poehali.dev/82db012d-128a-4cd5-b059-928fd5115f6d';

const cars = [
  {
    id: 1,
    img: 'https://cdn.poehali.dev/projects/e21ce7c1-2ef2-434f-b883-c9e47a6bd6c8/files/28f5a924-05f6-4169-8c5d-780a6c684a11.jpg',
    name: 'Волга ГАЗ-21',
    desc: 'Легендарная советская классика. Чёрный глянец, хромированные детали — идеально для торжественных выездов.',
    year: '1950–1970-е',
  },
  {
    id: 2,
    img: 'https://cdn.poehali.dev/projects/e21ce7c1-2ef2-434f-b883-c9e47a6bd6c8/files/e3f8e7f5-e35c-4b8f-bca2-a62ed13db36c.jpg',
    name: 'Чайка ГАЗ-13',
    desc: 'Представительский лимузин эпохи СССР. Бордовый цвет, роскошный силуэт — создаст незабываемую атмосферу.',
    year: '1959–1981',
  },
  {
    id: 3,
    img: 'https://cdn.poehali.dev/projects/e21ce7c1-2ef2-434f-b883-c9e47a6bd6c8/files/841194a9-2b0c-43cb-84cb-6e15a42eee67.jpg',
    name: 'ЗИЛ-111',
    desc: 'Белоснежный советский Кадиллак. Свадебное убранство, ленты и цветы — ваш праздник запомнят все гости.',
    year: '1958–1967',
  },
];

export default function Gallery() {
  const navigate = useNavigate();
  const [active, setActive] = useState<number | null>(null);
  const [bookingCar, setBookingCar] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [sending, setSending] = useState(false);

  const activeCar = cars.find((c) => c.id === active);

  const openBooking = (carName: string) => {
    setBookingCar(carName);
    setActive(null);
    setForm({ name: '', phone: '', message: `Хочу забронировать: ${carName}` });
  };

  const submitBooking = async (e: React.FormEvent) => {
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
        setBookingCar(null);
      } else {
        toast({ title: 'Не удалось отправить', description: 'Позвоните нам по телефону.', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Ошибка сети', description: 'Попробуйте позвонить нам.', variant: 'destructive' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 font-display font-bold text-lg tracking-wide"
          >
            <span className="grid place-items-center w-9 h-9 rounded-lg bg-primary text-primary-foreground">
              <Icon name="Car" size={20} />
            </span>
            <span>AutoVod</span>
          </button>
          <Button variant="outline" size="sm" onClick={() => navigate('/')}>
            <Icon name="ArrowLeft" size={16} className="mr-1.5" />
            На главную
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 text-center container">
        <span className="text-primary text-sm font-semibold uppercase tracking-[0.2em]">Наш парк</span>
        <h1 className="font-display font-bold uppercase text-4xl sm:text-5xl mt-3 tracking-tight">
          Ретро-автомобили
        </h1>
        <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
          Советская классика с номерами Ульяновска — 73 регион. Каждый автомобиль в отличном состоянии и готов украсить ваш праздник.
        </p>
      </section>

      {/* Gallery Grid */}
      <section className="container pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          {cars.map((car) => (
            <div
              key={car.id}
              className="group rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/50 transition-all hover:-translate-y-1"
            >
              <div
                className="relative overflow-hidden aspect-[4/3] cursor-pointer"
                onClick={() => setActive(car.id)}
              >
                <img
                  src={car.img}
                  alt={car.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                <div className="absolute bottom-3 left-4 text-xs text-muted-foreground font-semibold uppercase tracking-widest">
                  {car.year}
                </div>
                <div className="absolute top-3 right-3 grid place-items-center w-8 h-8 rounded-full bg-background/60 backdrop-blur-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <Icon name="ZoomIn" size={16} />
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-display font-semibold text-xl mb-2">{car.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{car.desc}</p>
                <Button
                  className="w-full font-semibold"
                  onClick={() => openBooking(car.name)}
                >Забронировать</Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-6">Хотите обсудить детали по телефону?</p>
          <a href="tel:+79192081001">
            <Button size="lg" variant="outline" className="font-semibold px-8 border-primary/40 hover:bg-primary/10">
              <Icon name="Phone" size={18} className="mr-2" />
              +7 919 208-10-01
            </Button>
          </a>
        </div>
      </section>

      {/* Lightbox */}
      {activeCar && (
        <div
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={() => setActive(null)}
        >
          <button
            className="absolute top-5 right-5 grid place-items-center w-10 h-10 rounded-full bg-muted hover:bg-muted/70 transition-colors"
            onClick={() => setActive(null)}
          >
            <Icon name="X" size={20} />
          </button>
          <div
            className="max-w-3xl w-full rounded-2xl overflow-hidden bg-card border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={activeCar.img} alt={activeCar.name} className="w-full object-cover max-h-[55vh]" />
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-display font-bold text-2xl">{activeCar.name}</h2>
                <span className="text-xs text-muted-foreground uppercase tracking-widest">{activeCar.year}</span>
              </div>
              <p className="text-muted-foreground mb-5">{activeCar.desc}</p>
              <Button
                className="w-full font-semibold h-12"
                onClick={() => openBooking(activeCar.name)}
              >
                <Icon name="CalendarCheck" size={18} className="mr-2" />
                Забронировать этот автомобиль
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {bookingCar && (
        <div
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={() => setBookingCar(null)}
        >
          <div
            className="max-w-lg w-full rounded-2xl bg-card border border-primary/30 neon-border p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Бронирование</p>
                <h2 className="font-display font-bold text-2xl">{bookingCar}</h2>
              </div>
              <button
                className="grid place-items-center w-9 h-9 rounded-full bg-muted hover:bg-muted/70 transition-colors"
                onClick={() => setBookingCar(null)}
              >
                <Icon name="X" size={18} />
              </button>
            </div>
            <form onSubmit={submitBooking} className="space-y-4">
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
                placeholder="Дата, мероприятие, пожелания..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="min-h-24 bg-background/60"
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
            </form>
          </div>
        </div>
      )}
    </div>
  );
}