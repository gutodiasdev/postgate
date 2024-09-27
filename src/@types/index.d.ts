export type CouponsResponse = {
  requestInfo: {
    status: string;
    message: string;
  },
  pagination: {
    page: number;
    size: number;
    totalSize: number;
    totalPage: number;
  },
  coupons: Coupon[]
}

export type Coupon = {
  id: number;
  description: string;
  code: string;
  discount: number;
  store: {
    id: number;
    name: string;
    image: string;
    link: string;
  },
  category: {
    id: number;
    name: string;
  },
  vigency: string;
  link: string;
}

export type StoresResponse = {
  requestInfo: {
    status: string;
    message: string;
  },
  pagination: {
    page: number;
    size: number;
    totalSize: number;
    totalPage: number;
  },
  stores: Store[]
}

export type Store = {
  id: number;
  name: string;
  thumbnail: string;
  link: string;
  hasOffer: number,
  maxCommission: number;
  events: StoreEvent[]
}

export type StoreEvent = {
  event: string;
  eventType: string;
  fixedCommission: boolean;
  commission: number;
}

export type SingleOfferResponse = {
  requestInfo: {
    status: string;
    message: string;
  },
  pagination: {
    page: number;
    size: number;
    totalSize: number;
    totalPage: number;
  },
  offers: Offer[]
}

export type OffersResponse = {
  requestInfo: {
    status: string;
    message: string;
  },
  pagination: {
    page: number;
    size: number;
    totalSize: number;
    totalPage: number;
  },
  offers: Offer[]
}

export type Offer = {
  id: string;
  image: string;
  title: string;
  old_price: string;
  price: string;
  destination_link: string;
  store_image: string | null;
  store_name: string;
  description: string;
  expiration_date: string;
  created_at: string;
  is_on_showcase: boolean;
  is_featured: boolean;
  is_free_shipping: boolean;
  resources_id: string;
  short_link: string;
  categories: [];
};

export type OfferStore = {
  id: number;
  name: string;
  thumbnail: string;
  link: string;
  invisible: boolean;
  needPermission: boolean;
}

export type GetOffersParams = {
  size?: number;
  page?: number;
  sort?: string;
}

export type OfferDataInput = {
  image: string;
  title: string;
  price: string;
  old_price: string;
  destination_link: string;
  store_name: string;
  expiration_date: string;
  description: string;
}

export type SocialSoulOfferDataInput = {
  image: string;
  title: string;
  price: number;
  old_price: number;
  destination_link: string;
  store_name: string;
  store_image: string;
  description: string;
}

export type FetchStoreOffersResponse = {
  status: string,
  message: string,
  data: {
    id: string,
    store_image: string,
    store_name: string,
    store_name_display: string,
    lomadee_source_id: string | null,
    admitad_verification: string | null,
    role: string,
    user_id: string,
    social_media: {
      facebook?: string;
      whatsapp?: string;
      instagram?: string;
      telegram?: string;
      twitter?: string;
    },
    resources: {
      offers: OfferWithClicks[]
    }
  },
  featured: OfferWithClicks[]
}

export type APIOffer = {
  id: string;
  image: string;
  title: string;
  old_price: string;
  price: string;
  destination_link: string;
  store_image: string;
  store_name: string;
  description: string;
  expiration_date: string;
  created_at: string;
  is_on_showcase: boolean;
  is_featured: boolean;
  is_free_shipping: boolean;
  resources_id: string;
  short_link: string;
}

export type OfferWithClicks = APIOffer & {
  resources: {
    user_profile: {
      store_name: string,
      store_name_display: string,
      store_image: string,
      social_media: {
        id: string,
        facebook: string,
        whatsapp: string,
        instagram: string,
        telegram: string,
        twitter: string,
        user_profile_id: string
      }
    }
  },
  _count: {
    offer_clicks: number;
  };
}

export type MeResponse = {
  status: string,
  user: {
    id: string,
    name: string,
    email: string,
    created_at: string,
    user_profile: {
      id: string,
      store_image: string,
      store_name: string,
      store_name_display: string,
      lomadee_source_id: string,
      admitad_verification: string,
      role: string,
      user_id: string,
      resources: {
        id: string,
        created_at: string,
        user_profile_id: string,
      },
      social_media?: {
        facebook?: string;
        whatsapp?: string;
        instagram?: string;
        telegram?: string;
        twitter?: string;
      }
    }
  }
}

export type UserMeResponse = {
  id: string,
  name: string,
  email: string,
  created_at: string,
  user_profile: {
    id: string,
    store_image: string,
    store_name: string,
    role: string,
    user_id: string,
    resources: {
      id: string,
      created_at: string,
      user_profile_id: string
    }
  }
}

export type SignInFormInput = {
  email: string;
  password: string;
}

export type SignInFormOutput = {
  token: string,
  user: {
    id: string;
    name: string;
    email: string;
    created_at: string;
    user_profile: {
      id: string;
      store_image: string;
      store_name: string;
      store_name_display: string;
      lomadee_source_id: string | null;
      admitad_verification: string | null;
      payment_customer_id: string | null;
      role: string;
      user_id: string;
      social_media: any | null;
      resources: {
        id: string;
      };
    };
    agree_with_policies: boolean
  }
}

export type User = {
  id: string;
  email: string;
  username: null | undefined | string;
  userSubscription: {
    id: string;
    usage: number;
    usageLimit: number;
    stripeCurrentPeriodEnd: string | null;
    stripeCustomerId: string | null;
    stripePriceId: string | null;
    stripeSubscriptionId: string | null;
    subscriptionLevel: string;
    createdAt: string;
    updatedAt: string;
    userId: string;
  } | null;
}

export type SetShowcaseProductInput = {
  isOnShowcase: string;
  offerId: string;
}

export type Redirector = {
  id: string;
  title: string;
  description: string;
  redirectorLink: string;
  resources_id: string;
  groups: Group[],
  totalClicks: number | null
}

export type Group = {
  id: string;
  title: string;
  destinationLink: string;
  members: number;
  limit: number;
  redirectorId: string;
}

export type TextNodeProps = {
  message: string;
}

export type ImageNodeProps = {
  userId: string;
  image: File | string;
  message: string;
}

export type IntervalNodeProps = {
  interval: string;
  unity: string;
}

export type RemoteWappGroup = {
  id: string;
  subject: string;
  subjectOwner: string;
  subjectTime: number;
  size: number;
  creation: number;
  desc: string;
  descId: string;
  restrict: boolean;
  announce: boolean;
  isCommunity: boolean,
  isCommunityAnnounce: boolean;
  joinApprovalMode: boolean;
  memberAddMode: boolean;
  participants: Participant[];
}

export type WappGroup = {
  id: string;
  whatsappId: string;
  whatsappName: string;
  isGroup: boolean;
  whatsappSessionId: string;
  updatedAt: string;
  createdAt: string;
  participants: null | number;
  groupInviteCode: null | string;
  groupInviteLink: null | string;
}

export type WappChat = {
  id: string,
  remoteJid: string,
  createdAt: string,
  updatedAt: string,
  instanceId: string
}

export type SendingList = {
  id: string;
  userId: string;
  whatsappSessionId: string;
  name: string | null;
  list: string | null;
}

export type CreateRedirectorInput = {
  title: string;
}

export type Instance = {
  id: string;
  instanceId: string | null;
  name: string | null;
  description: string | null;
  session: string | null;
  status: string | null;
  qr: string | null;
  token: string | null;
  retries: number | null;
  userId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type Session = {
  id: string;
  userId: string;
  session?: string;
  status?: string;
  qr?: string;
  retries?: number;
  user?: UserInfo;
}

export type UserInfo = {
  pushname: string;
  wid: {
    server: string;
    user: string;
    _serialized: string;
  };
  platform: string;
}

export type Workflow = {
  id: string;
  title: string;
  userId: string;
  description?: string;
  nodes?: string;
  edges?: string;
  createdAt: string;
  updatedAt: string;
}

export type Scheduling = {
  id: string;
  startTime: string;
  whatsappSessionId: string;
  userId: string;
  sendingListId: string;
  workflowId: string;
  status: string;
  sendingList: {
    name: string;
  };
  workflow: {
    title: string;
  }
}

export type Appointment = {
  id: string;
  startTime: string | null;
  whatsappSessionId: string;
  status: string;
  userId: string | null;
  sendingListId: string | null;
  workflowId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type DashboardResult = {
  data: {
    pendingAppointments: number;
    completedAppointments: number;
    groupsCount: number;
  }
};