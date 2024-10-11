import { useState, useEffect } from 'react';

export function useAuth() {
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/user', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const userData = await response.json();
          setUsername(userData.username);
        } else {
          // Handle invalid token by clearing it
          localStorage.removeItem('token');
          setUsername(null);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        localStorage.removeItem('token');
        setUsername(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return { username, isLoading };
}