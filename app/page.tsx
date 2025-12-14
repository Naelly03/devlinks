import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function getLinks() {
  const links = await prisma.link.findMany()
  return links
}

export default async function Home() {
  const links = await getLinks()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-4 text-white">
      <div className="mb-6 h-24 w-24 overflow-hidden rounded-full border-2 border-purple-500">
        <img 
          src="https://github.com/Naelly03.png" 
          alt="Foto de Perfil" 
          className="h-full w-full object-cover"
        />
      </div>

      <h1 className="mb-2 text-2xl font-bold">Naelly Vitoria</h1>
      <p className="mb-8 text-gray-400">Dev & Entusiasta de tecnologia</p>

      {/* Lista de Links */}
      <div className="flex w-full max-w-sm flex-col gap-4">
        {links.length === 0 ? (
          <p className="text-center text-gray-500">Nenhum link cadastrado ainda...</p>
        ) : (
          links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center rounded-lg bg-gray-800 p-4 font-medium transition-colors hover:bg-purple-600"
            >
              {link.title}
            </a>
          ))
        )}
      </div>
    </div>
  )
}