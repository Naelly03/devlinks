import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function getLinks() {
  const links = await prisma.link.findMany({
    orderBy: { createdAt: 'desc' }
  })
  return links
}

function formatUrl(url: string) {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  return `https://${url}`
}

function getButtonStyle(title: string) {
  const text = title.toLowerCase()

  if (text.includes('linkedin')) {
    return 'bg-blue-600 text-white hover:bg-blue-700'
  }
  
  if (text.includes('github')) {
    return 'bg-[#24292F] text-white hover:bg-black'
  }
  
  if (text.includes('portifolio') || text.includes('portfolio')) {
    return 'bg-purple-600 text-white hover:bg-purple-700'
  }

  return 'bg-gray-800 text-white hover:bg-gray-900'
}

export default async function Home() {
  const links = await getLinks()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 text-gray-800">
      
      <div className="mb-6 h-28 w-28 overflow-hidden rounded-full border-4 border-white shadow-lg">
        <img 
          src="https://github.com/Naelly03.png" 
          alt="Foto de Perfil" 
          className="h-full w-full object-cover"
        />
      </div>

      <h1 className="mb-2 text-3xl font-bold">Naelly Vitoria</h1>
      <p className="mb-8 text-gray-500">Developer & Tech Enthusiast</p>

      <div className="flex w-full max-w-sm flex-col gap-4">
        {links.length === 0 ? (
          <p className="text-center text-gray-500">Nenhum link cadastrado ainda...</p>
        ) : (
          links.map((link) => (
            <a
              key={link.id}
              href={formatUrl(link.url)}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex w-full items-center justify-center rounded-lg p-4 font-bold transition-colors ${getButtonStyle(link.title)}`}
            >
              {link.title}
            </a>
          ))
        )}
      </div>
      
      <a href="/login" className="fixed bottom-4 right-4 text-xs text-gray-400 hover:text-gray-600">
        Admin
      </a>
    </div>
  )
}