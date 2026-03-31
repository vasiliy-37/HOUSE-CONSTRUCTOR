import { useState, useEffect, useCallback } from 'react';
import { 
  TextInput, TextArea, Button, Card, Text, Flex, Box, Icon, Loader 
} from '@gravity-ui/uikit';
import { FilePlus, TrashBin, Pencil } from '@gravity-ui/icons';

interface IProject {
  _id: string;
  title: string;
  description: string;
  coverImage: string;
  images: string[];
}

const AdminGalery = () => {
  const [albums, setAlbums] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<IProject, '_id'>>({
    title: '', description: '', coverImage: '', images: []
  });

  // Используем useCallback, чтобы React не ругался в useEffect
  const fetchAlbums = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:3001/api/albums');
      const data = await res.json();
      setAlbums(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  const startEdit = (album: IProject) => {
    setEditingId(album._id);
    setForm({
      title: album.title,
      description: album.description,
      coverImage: album.coverImage,
      images: album.images
    });
  };

  const handleSave = async () => {
    const url = editingId && editingId !== 'new'
      ? `http://localhost:3001/api/albums/${editingId}` 
      : 'http://localhost:3001/api/albums';
    const method = editingId && editingId !== 'new' ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    if (res.ok) {
      setEditingId(null);
      fetchAlbums();
    }
  };

  if (loading) return <Box style={{padding: '50px'}}><Loader size="l" /></Box>;

  return (
    <Box style={{ padding: '40px' }}>
      <Card style={{ maxWidth: '800px', margin: '0 auto', padding: '32px' }} view="raised">
        {!editingId ? (
          <Flex direction="column" gap="6">
            <Flex justifyContent="space-between" alignItems="center">
              <Text variant="header-2" style={{fontWeight: 'bold'}}>АЛЬБОМЫ</Text>
              <Button view="action" onClick={() => {
                setEditingId('new'); 
                setForm({title: '', description: '', coverImage: '', images: []});
              }}>+ Создать</Button>
            </Flex>

            <Flex direction="column" gap="2">
              {albums.map(album => (
                <Box 
                  key={album._id} 
                  style={{ border: '1px solid #e1e1e1', padding: '12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  {/* Заменили weight на style fontWeight */}
                  <Text variant="body-2" style={{fontWeight: 'bold'}}>{album.title}</Text>
                  <Flex gap="2">
                    <Button onClick={() => startEdit(album)}><Icon data={Pencil} size={16} /></Button>
                    <Button view="flat-danger" onClick={async () => {
                      if(window.confirm('Удалить альбом?')) {
                        await fetch(`http://localhost:3001/api/albums/${album._id}`, { method: 'DELETE' });
                        fetchAlbums();
                      }
                    }}><Icon data={TrashBin} size={16} /></Button>
                  </Flex>
                </Box>
              ))}
            </Flex>
          </Flex>
        ) : (
          <Flex direction="column" gap="6">
            <Button onClick={() => setEditingId(null)} view="flat">← Назад</Button>
            
            <Box>
                <Text variant="body-1" style={{marginBottom: '4px', display: 'block'}}>Заголовок</Text>
                <TextInput 
                  value={form.title} 
                  onUpdate={(v) => setForm({...form, title: v})} 
                />
            </Box>

            <Box>
                <Text variant="body-1" style={{marginBottom: '4px', display: 'block'}}>Описание</Text>
                <TextArea 
                  value={form.description} 
                  onUpdate={(v) => setForm({...form, description: v})} 
                />
            </Box>

            <Box>
              <Text style={{marginBottom: '10px', display: 'block', fontSize: '12px', fontWeight: 'bold'}}>ФОТОГРАФИИ</Text>
              <Flex gap="3" wrap="wrap">
                {form.images.map((img, idx) => (
                  <Box key={idx} style={{ position: 'relative', width: '100px', height: '100px' }}>
                    <img 
                      src={img} 
                      alt="preview"
                      onClick={() => setForm({...form, coverImage: img})}
                      style={{ 
                        width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px', cursor: 'pointer',
                        outline: form.coverImage === img ? '3px solid #007afc' : 'none'
                      }} 
                    />
                    <button 
                      onClick={() => setForm({...form, images: form.images.filter((_, i) => i !== idx)})}
                      style={{ position: 'absolute', top: -5, right: -5, background: 'red', color: 'white', borderRadius: '50%', width: '20px', height: '20px', border: 'none', cursor: 'pointer' }}
                    >✕</button>
                  </Box>
                ))}
                <label style={{ cursor: 'pointer' }}>
                  <Box style={{ width: '100px', height: '100px', border: '2px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' }}>
                    <Icon data={FilePlus} size={24} />
                    <input type="file" multiple hidden onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      files.forEach(f => {
                        const r = new FileReader();
                        r.onload = () => setForm(p => ({...p, images: [...p.images, r.result as string]}));
                        r.readAsDataURL(f);
                      });
                    }} />
                  </Box>
                </label>
              </Flex>
            </Box>

            <Button view="action" size="xl" onClick={handleSave}>Сохранить</Button>
          </Flex>
        )}
      </Card>
    </Box>
  );
};

export default AdminGalery;
