export const LANGUAGES = ['en', 'pt'] as const

export type Language = (typeof LANGUAGES)[number]

const en = {
  appName: 'Lume',
  tagline: 'habit tracker',
  welcomeBack: 'Welcome back',
  language: 'Language',

  loginTitle: 'Welcome',
  loginSubtitle: 'Sign in to keep documenting every habit, one day at a time.',
  continueWithGoogle: 'Continue with Google',
  signingIn: 'Signing in...',
  signOut: 'Sign out',
  signedInAs: 'Signed in as {email}',
  errorGoogleSignIn: 'Could not sign in with Google',
  loginFootnote: 'No password to remember. Your Google account is all it takes.',
  showcaseTitle: 'Every minute, made visible',
  showcaseBody: 'Time each session and watch the year fill in with color.',

  loading: 'Loading...',
  loadErrorTitle: 'Could not load your habits',
  loadErrorFallback: 'Failed to reach the API.',
  loadErrorHint: 'Check that the API is running on localhost:3001.',
  retry: 'Try again',

  emptyTitle: 'No habits here yet',
  emptyBody: 'Create your first habit and start filling the map, one day at a time.',

  newHabit: 'New habit',
  newHabitHint: 'Level 1 stands for a day when nothing was done.',
  editHabit: 'Edit habit',
  editHabitHint: 'Changing the levels recalculates days already recorded.',
  deleteHabit: 'Delete habit',
  habitActions: 'Actions for habit {name}',
  deleteConfirmTitle: 'Delete "{name}"?',
  deleteConfirmBody: 'Every record for this habit goes with it. This cannot be undone.',

  name: 'Name',
  namePlaceholder: 'Reading',
  levels: 'Levels',
  levelsCount: '{count} of {max}',
  levelLabel: 'Level {n}',
  minutesUnit: 'minutes',
  removeLevel: 'Remove level {n}',
  addLevel: 'Add level',

  cancel: 'Cancel',
  save: 'Save',
  saving: 'Saving...',
  createHabit: 'Create habit',
  deleteAction: 'Delete',
  deleting: 'Deleting...',

  selectHabit: 'Select a habit',
  habit: 'Habit',
  date: 'Date',
  level: 'Level',
  selectLevel: 'Select the level',
  logDay: 'Log day',
  logDayHint: 'Mark the level reached on a specific date.',
  logDayMissing: 'Select the habit and the level',
  levelOption: '{order}. {minutes}',

  activeDays: 'days with progress in the last year',
  lastYear: 'Last 365 days',
  noRecord: 'No record',
  less: 'Less',
  more: 'More',
  legendLevel: 'Level {order}: {minutes}',
  clearRecord: 'Clear record',

  start: 'Start',
  resume: 'Resume',
  pause: 'Pause',
  reset: 'Reset',
  finish: 'Finish',

  minuteOne: '1 minute',
  minuteOther: '{count} minutes',

  nameRequired: 'Enter the habit name',
  nameTooLong: 'Maximum of 60 characters',
  minutesNonNegative: 'Minutes must be non-negative',
  minutesRequired: 'Enter the minutes for this level',
  minLevels: 'Minimum of {count} levels',
  maxLevels: 'Maximum of {count} levels',

  errorCreateHabit: 'Could not create the habit',
  errorSaveHabit: 'Could not save the habit',
  errorDeleteHabit: 'Could not delete the habit',
  errorSaveEntry: 'Could not save',

  HABIT_NAME_REQUIRED: 'Habit name is required',
  HABIT_LEVEL_COUNT: 'A habit must have between {min} and {max} levels',
  LEVEL_MINUTES_INVALID: 'Level minutes must be a non-negative number',
  LEVEL_MINUTES_DECREASING: 'Level minutes must be non-decreasing',
  INVALID_DATE: 'Invalid date (use YYYY-MM-DD)',
  INVALID_LEVEL: 'Invalid level for this habit',
  MINUTES_INVALID: 'Minutes must be a non-negative number',
  HABIT_NOT_FOUND: 'Habit not found',
  ENTRY_NOT_FOUND: 'Entry not found',
  UNAUTHORIZED: 'Your session has expired. Sign in again.',
  GOOGLE_AUTH_FAILED: 'Google could not confirm your account',
  GOOGLE_UNAVAILABLE: 'Google sign-in is unavailable right now'
}

export type TranslationKey = keyof typeof en

const pt: Record<TranslationKey, string> = {
  appName: 'Lume',
  tagline: 'habitos em dia',
  welcomeBack: 'Bem vindo de volta',
  language: 'Idioma',

  loginTitle: 'Bem vindo',
  loginSubtitle: 'Entre para continuar documentando cada habito, um dia de cada vez.',
  continueWithGoogle: 'Continuar com Google',
  signingIn: 'Entrando...',
  signOut: 'Sair',
  signedInAs: 'Conectado como {email}',
  errorGoogleSignIn: 'Nao foi possivel entrar com o Google',
  loginFootnote: 'Nenhuma senha para lembrar. Sua conta Google basta.',
  showcaseTitle: 'Cada minuto, a vista',
  showcaseBody: 'Cronometre cada sessao e veja o ano se encher de cor.',

  loading: 'Carregando...',
  loadErrorTitle: 'Nao foi possivel carregar os habitos',
  loadErrorFallback: 'Falha ao falar com a API.',
  loadErrorHint: 'Confira se a API esta no ar em localhost:3001.',
  retry: 'Tentar de novo',

  emptyTitle: 'Nenhum habito por aqui ainda',
  emptyBody: 'Crie seu primeiro habito e comece a preencher o mapa, um dia de cada vez.',

  newHabit: 'Novo habito',
  newHabitHint: 'O nivel 1 representa o dia em que nada foi feito.',
  editHabit: 'Editar habito',
  editHabitHint: 'Mudar os niveis recalcula os dias ja registrados.',
  deleteHabit: 'Excluir habito',
  habitActions: 'Acoes do habito {name}',
  deleteConfirmTitle: 'Excluir "{name}"?',
  deleteConfirmBody: 'Todos os registros desse habito vao embora com ele. Nao da para desfazer.',

  name: 'Nome',
  namePlaceholder: 'Leitura',
  levels: 'Niveis',
  levelsCount: '{count} de {max}',
  levelLabel: 'Nivel {n}',
  minutesUnit: 'minutos',
  removeLevel: 'Remover nivel {n}',
  addLevel: 'Adicionar nivel',

  cancel: 'Cancelar',
  save: 'Salvar',
  saving: 'Salvando...',
  createHabit: 'Criar habito',
  deleteAction: 'Excluir',
  deleting: 'Excluindo...',

  selectHabit: 'Selecione um habito',
  habit: 'Habito',
  date: 'Data',
  level: 'Nivel',
  selectLevel: 'Selecione o nivel',
  logDay: 'Registrar dia',
  logDayHint: 'Marque o nivel alcancado em uma data especifica.',
  logDayMissing: 'Selecione o habito e o nivel',
  levelOption: '{order}. {minutes}',

  activeDays: 'dias com progresso no ultimo ano',
  lastYear: 'Ultimos 365 dias',
  noRecord: 'Sem registro',
  less: 'Menos',
  more: 'Mais',
  legendLevel: 'Nivel {order}: {minutes}',
  clearRecord: 'Limpar registro',

  start: 'Iniciar',
  resume: 'Retomar',
  pause: 'Pausar',
  reset: 'Reiniciar',
  finish: 'Finalizar',

  minuteOne: '1 minuto',
  minuteOther: '{count} minutos',

  nameRequired: 'Informe o nome do habito',
  nameTooLong: 'Maximo de 60 caracteres',
  minutesNonNegative: 'Os minutos devem ser nao negativos',
  minutesRequired: 'Informe os minutos para este nivel',
  minLevels: 'Minimo de {count} niveis',
  maxLevels: 'Maximo de {count} niveis',

  errorCreateHabit: 'Nao foi possivel criar o habito',
  errorSaveHabit: 'Nao foi possivel salvar o habito',
  errorDeleteHabit: 'Nao foi possivel excluir o habito',
  errorSaveEntry: 'Nao foi possivel salvar',

  HABIT_NAME_REQUIRED: 'O nome do habito e obrigatorio',
  HABIT_LEVEL_COUNT: 'O habito precisa ter entre {min} e {max} niveis',
  LEVEL_MINUTES_INVALID: 'Os minutos de cada nivel devem ser um numero nao negativo',
  LEVEL_MINUTES_DECREASING: 'Os minutos dos niveis devem ser nao decrescentes',
  INVALID_DATE: 'Data invalida (use YYYY-MM-DD)',
  INVALID_LEVEL: 'Nivel invalido para este habito',
  MINUTES_INVALID: 'Os minutos devem ser um numero nao negativo',
  HABIT_NOT_FOUND: 'Habito nao encontrado',
  ENTRY_NOT_FOUND: 'Registro nao encontrado',
  UNAUTHORIZED: 'Sua sessao expirou. Entre de novo.',
  GOOGLE_AUTH_FAILED: 'O Google nao confirmou sua conta',
  GOOGLE_UNAVAILABLE: 'O login com Google esta indisponivel agora'
}

export const translations: Record<Language, Record<TranslationKey, string>> = { en, pt }

export const WEEKDAYS: Record<Language, string[]> = {
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  pt: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']
}

export const MONTHS: Record<Language, string[]> = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  pt: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
}

export const LANGUAGE_LABELS: Record<Language, string> = { en: 'EN', pt: 'PT' }
