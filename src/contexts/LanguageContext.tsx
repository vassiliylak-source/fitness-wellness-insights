
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'ru';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguage] = useState<Language>('en');

  const translations = {
    en: {
      // Hero Section
      'hero.title': 'Fitness & Wellness Platform',
      'hero.subtitle': 'Decode your fitness screenshots, practice guided breathing, AND track holistic wellness. Get pro-level insights from data analysis plus mindfulness tools for complete well-being',
      
      // Navigation
      'nav.screenshot': 'Screenshot Analysis',
      'nav.breathing': '4-6 Breathing',
      'nav.journal': 'Wellness Journal',
      
      // Upload Section
      'upload.title': 'Upload Your Fitness Screenshot',
      'upload.subtitle': 'Drag and drop or click to upload your fitness app data',
      'upload.analyzing': 'Analyzing image with OCR...',
      'upload.reading': 'Reading text and detecting fitness metrics',
      'upload.error.title': 'Not a Fitness Screenshot',
      'upload.error.supported': 'Supported apps include:',
      'upload.error.apps': 'Apple Health, Strava, Garmin Connect, Fitbit, Samsung Health, Google Fit, and more',
      'upload.different': 'Upload Different Image',
      'upload.another': 'Analyze Another Image',
      
      // Insights
      'insights.title': 'Your Fitness Insights Are Ready! 🎯',
      
      // Wellness Journal
      'journal.title': 'Daily Recovery & Wellness Journal',
      'journal.subtitle': '🧘 Track wellness inside and out. Go beyond metrics to reflect on how you feel, spot patterns, and support recovery from burnout, training fatigue, or daily stress.',
      'journal.entry.title': "Today's Entry",
      'journal.entry.subtitle': 'Rate your wellness on a scale of 1-10 and add your reflections',
      'journal.scales.mood': 'Mood',
      'journal.scales.energy': 'Energy Level',
      'journal.scales.stress': 'Stress Level',
      'journal.scales.sleep': 'Sleep Quality',
      'journal.scales.recovery': 'Recovery',
      'journal.reflections.notes': 'Daily Notes & Reflections',
      'journal.reflections.notes.placeholder': 'How are you feeling today? What\'s on your mind? Any physical sensations or emotional insights...',
      'journal.reflections.goals': 'Goals & Intentions',
      'journal.reflections.goals.placeholder': 'What do you want to focus on today? Any recovery or wellness goals...',
      'journal.reflections.gratitude': 'Gratitude & Wins',
      'journal.reflections.gratitude.placeholder': 'What are you grateful for? Any small wins or positive moments...',
      'journal.save': 'Save Today\'s Entry',
      'journal.analyze': 'AI Analysis',
      'journal.analyzing': 'Analyzing...',
      'journal.analysis.title': 'Your Wellness Analysis',
      
      // Scale labels
      'scale.mood.low': '😔 Low',
      'scale.mood.high': '😊 Great',
      'scale.energy.low': '⚡ Drained',
      'scale.energy.high': '🔋 Energized',
      'scale.stress.low': '😌 Calm',
      'scale.stress.high': '😰 Stressed',
      'scale.sleep.low': '😴 Poor',
      'scale.sleep.high': '🌙 Excellent',
      'scale.recovery.low': '🔴 Fatigued',
      'scale.recovery.high': '🟢 Recovered',
      
      // Privacy & Support
      'privacy.title': 'Your Privacy is Protected',
      'health.disclaimer': 'Health Disclaimer',
      'health.disclaimer.text': 'AI analysis can make mistakes and should not replace professional medical or mental health advice. If you\'re experiencing persistent health concerns, please consult with a qualified healthcare provider or therapist.',
      'support.text': '💜Enjoying this app? If you\'d like to support the creator, consider treating him to a coffee with a small donation:',
      'support.button': '☕ Buy me a coffee',
      'support.thanks': 'Thank you for your support!',
      
      // Footer
      'footer.copyright': 'All rights reserved.',
    },
    ru: {
      // Hero Section
      'hero.title': 'Платформа Фитнеса и Здоровья',
      'hero.subtitle': 'Анализируйте скриншоты фитнеса, практикуйте дыхательные упражнения И отслеживайте общее самочувствие. Получайте профессиональные инсайты из анализа данных плюс инструменты осознанности для полного благополучия',
      
      // Navigation
      'nav.screenshot': 'Анализ Скриншотов',
      'nav.breathing': 'Дыхание 4-6',
      'nav.journal': 'Дневник Здоровья',
      
      // Upload Section
      'upload.title': 'Загрузите Скриншот Фитнеса',
      'upload.subtitle': 'Перетащите или нажмите, чтобы загрузить данные вашего фитнес-приложения',
      'upload.analyzing': 'Анализ изображения с помощью OCR...',
      'upload.reading': 'Чтение текста и обнаружение фитнес-метрик',
      'upload.error.title': 'Это не фитнес-скриншот',
      'upload.error.supported': 'Поддерживаемые приложения:',
      'upload.error.apps': 'Apple Health, Strava, Garmin Connect, Fitbit, Samsung Health, Google Fit и другие',
      'upload.different': 'Загрузить Другое Изображение',
      'upload.another': 'Анализировать Другое Изображение',
      
      // Insights
      'insights.title': 'Ваши Фитнес-Инсайты Готовы! 🎯',
      
      // Wellness Journal
      'journal.title': 'Дневник Восстановления и Здоровья',
      'journal.subtitle': '🧘 Отслеживайте самочувствие изнутри и снаружи. Выходите за рамки метрик, чтобы понять, как вы себя чувствуете, находить паттерны и поддерживать восстановление от выгорания, усталости от тренировок или ежедневного стресса.',
      'journal.entry.title': 'Сегодняшняя Запись',
      'journal.entry.subtitle': 'Оцените свое самочувствие по шкале от 1 до 10 и добавьте свои размышления',
      'journal.scales.mood': 'Настроение',
      'journal.scales.energy': 'Уровень Энергии',
      'journal.scales.stress': 'Уровень Стресса',
      'journal.scales.sleep': 'Качество Сна',
      'journal.scales.recovery': 'Восстановление',
      'journal.reflections.notes': 'Ежедневные Заметки и Размышления',
      'journal.reflections.notes.placeholder': 'Как вы себя чувствуете сегодня? О чем думаете? Какие физические ощущения или эмоциональные инсайты...',
      'journal.reflections.goals': 'Цели и Намерения',
      'journal.reflections.goals.placeholder': 'На чем вы хотите сосредоточиться сегодня? Есть ли цели восстановления или здоровья...',
      'journal.reflections.gratitude': 'Благодарность и Достижения',
      'journal.reflections.gratitude.placeholder': 'За что вы благодарны? Какие-то маленькие победы или позитивные моменты...',
      'journal.save': 'Сохранить Сегодняшнюю Запись',
      'journal.analyze': 'ИИ Анализ',
      'journal.analyzing': 'Анализирую...',
      'journal.analysis.title': 'Ваш Анализ Здоровья',
      
      // Scale labels
      'scale.mood.low': '😔 Плохо',
      'scale.mood.high': '😊 Отлично',
      'scale.energy.low': '⚡ Истощен',
      'scale.energy.high': '🔋 Энергичен',
      'scale.stress.low': '😌 Спокоен',
      'scale.stress.high': '😰 В стрессе',
      'scale.sleep.low': '😴 Плохо',
      'scale.sleep.high': '🌙 Отлично',
      'scale.recovery.low': '🔴 Утомлен',
      'scale.recovery.high': '🟢 Восстановлен',
      
      // Privacy & Support
      'privacy.title': 'Ваша Конфиденциальность Защищена',
      'health.disclaimer': 'Медицинский Дисклеймер',
      'health.disclaimer.text': 'ИИ анализ может допускать ошибки и не должен заменять профессиональную медицинскую консультацию или консультацию по психическому здоровью. Если у вас есть постоянные проблемы со здоровьем, обратитесь к квалифицированному медицинскому работнику или терапевту.',
      'support.text': '💜Нравится это приложение? Если вы хотите поддержать создателя, угостите его кофе небольшим пожертвованием:',
      'support.button': '☕ Купить мне кофе',
      'support.thanks': 'Спасибо за вашу поддержку!',
      
      // Footer
      'footer.copyright': 'Все права защищены.',
    }
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
