const API_URL = process.env.NEXT_PUBLIC_API_URL;

// 添加默认请求配置
const defaultOptions = {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json'
  }
};

// 修改 API 调用方法
export const authAPI = {
  login: async (credentials) => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      ...defaultOptions,
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    return response.json();
  },
  // ... 其他方法
};

// 添加请求拦截器
const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  if (token) {
    options.headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    };
  }
  const response = await fetch(url, {
    ...defaultOptions,
    ...options
  });
  return response;
};

// MOD相关API
export const modAPI = {
  // 获取MOD列表
  getMods: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_URL}/api/mods?${queryString}`);
    return response.json();
  },

  // 获取MOD详情
  getMod: async (id) => {
    const response = await fetch(`${API_URL}/api/mods/${id}`);
    return response.json();
  },

  // 上传MOD
  uploadMod: async (formData, token) => {
    const response = await fetch(`${API_URL}/api/mods/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    return response.json();
  },
};

// 整合包相关API
export const modpackAPI = {
  // 获取整合包列表
  getModpacks: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_URL}/api/modpacks?${queryString}`);
    return response.json();
  },

  // 获取整合包详情
  getModpack: async (id) => {
    const response = await fetch(`${API_URL}/api/modpacks/${id}`);
    return response.json();
  },

  // 上传整合包
  uploadModpack: async (formData, token) => {
    const response = await fetch(`${API_URL}/api/modpacks/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    return response.json();
  },
};

// 评论相关API
export const commentAPI = {
  // 获取评论列表
  getComments: async (resourceId, resourceType) => {
    const response = await fetch(`${API_URL}/api/${resourceType}/${resourceId}/comments`);
    return response.json();
  },

  // 添加评论
  addComment: async (resourceId, resourceType, content, token) => {
    const response = await fetch(`${API_URL}/api/${resourceType}/${resourceId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });
    return response.json();
  },
};

// 用户相关API
export const userAPI = {
  // 获取用户信息
  getUserInfo: async (token) => {
    const response = await fetch(`${API_URL}/api/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  // 更新用户信息
  updateUserInfo: async (formData, token) => {
    const response = await fetch(`${API_URL}/api/users/update`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    return response.json();
  },
}; 