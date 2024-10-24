import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Moon, Sun, Search } from 'lucide-react'
import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

type Command = {
  pnpm: string
  bun: string
  note: string
}

type Section = {
  title: string
  commands: Command[]
}

const sections: Section[] = [
  {
    title: "Dependencies",
    commands: [
      { pnpm: "pnpm add", bun: "bun add", note: "✓" },
      { pnpm: "pnpm install", bun: "bun install", note: "✓" },
      { pnpm: "pnpm remove", bun: "bun remove", note: "✓" },
      { pnpm: "pnpm update", bun: "bun update", note: "✓" },
      { pnpm: "pnpm dedupe", bun: "None", note: "No deduplication" },
      { pnpm: "pnpm audit", bun: "None", note: "No security checks" },
      { pnpm: "pnpm outdated", bun: "None", note: "Can't check updates" },
    ]
  },
  {
    title: "Monorepo",
    commands: [
      { pnpm: "pnpm -r run build", bun: "None", note: "No recursive commands" },
      { pnpm: "pnpm filter <pattern>", bun: "bun --filter <pattern>", note: "Basic only" },
      { pnpm: "pnpm -r publish", bun: "None", note: "No publishing" },
    ]
  },
  {
    title: "Package Info",
    commands: [
      { pnpm: "pnpm list", bun: "bun pm ls", note: "✓" },
      { pnpm: "pnpm why", bun: "None", note: "No dep analysis" },
      { pnpm: "pnpm root", bun: "None", note: "No root info" },
    ]
  },
  {
    title: "Store & Cache",
    commands: [
      { pnpm: "pnpm store status", bun: "None", note: "No store management" },
      { pnpm: "pnpm store prune", bun: "None", note: "No cleanup tools" },
      { pnpm: "pnpm cache clean", bun: "None", note: "No cache control" },
    ]
  },
  {
    title: "Script Running",
    commands: [
      { pnpm: "pnpm run", bun: "bun run", note: "✓" },
      { pnpm: "pnpm run -r", bun: "None", note: "No recursive" },
      { pnpm: "pnpm exec", bun: "bun pm exec", note: "✓" },
      { pnpm: "pnpm run --parallel", bun: "None", note: "No parallel" },
    ]
  },
]

export function PackageManagerComparison() {
  const [darkMode, setDarkMode] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  const filteredSections = sections.map(section => ({
    ...section,
    commands: section.commands.filter(command => 
      command.pnpm.toLowerCase().includes(searchTerm.toLowerCase()) ||
      command.bun.toLowerCase().includes(searchTerm.toLowerCase()) ||
      command.note.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(section => section.commands.length > 0)

  const missingCommands = sections.flatMap(section => 
    section.commands.filter(command => command.bun === "None")
  ).length

  // const chartData = sections.map(section => ({
  //   name: section.title,
  //   pnpm: section.commands.length,
  //   bun: section.commands.filter(command => command.bun !== "None").length,
  // }))

  return (
    <div className={`min-h-screen bg-background text-foreground`}>
      <div className="container max-w-3xl mx-auto p-4 space-y-6">
        <header className="flex justify-between items-center">
          <h1 className="text-2xl">Bun as a Package Manager:<strong> Reality Check</strong> </h1>
          <div className="flex items-center space-x-2">
            <Sun className="h-4 w-4" />
            <Switch className="data-[state=checked]:bg-muted" checked={darkMode} onCheckedChange={setDarkMode} />
            <Moon className="size-4" />
          </div>
        </header>

        <Badge variant="outline" className="border-destructive text-md">
          {missingCommands} missing commands in Bun vs pnpm
        </Badge>

        <Card>
          <CardHeader>
            <CardTitle>Key Note</CardTitle>
          </CardHeader>
          <CardContent>
            Bun's package manager lacks many advanced features. Core install/remove operations work, but complex project management is limited.
          </CardContent>
        </Card>

        {/* <Card> */}
        {/*   <CardHeader> */}
        {/*     <CardTitle>Command Comparison Chart</CardTitle> */}
        {/*   </CardHeader> */}
        {/*   <CardContent className="h-[300px]"> */}
        {/*     <ResponsiveContainer width="100%" height="100%"> */}
        {/*       <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}> */}
        {/*         <XAxis dataKey="name" /> */}
        {/*         <YAxis /> */}
        {/*         <Tooltip /> */}
        {/*         <Bar dataKey="pnpm" fill="hsl(var(--primary))" name="pnpm" /> */}
        {/*         <Bar dataKey="bun" fill="hsl(var(--secondary))" name="Bun" /> */}
        {/*       </BarChart> */}
        {/*     </ResponsiveContainer> */}
        {/*   </CardContent> */}
        {/* </Card> */}

        <div className="relative">
          <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search commands..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredSections.map((section, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-5/12">pnpm</TableHead>
                    <TableHead className="w-3/12">Bun</TableHead>
                    <TableHead className="w-4/12">Note</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {section.commands.map((command, cmdIndex) => (
                    <TableRow key={cmdIndex}>
                      <TableCell><code className="bg-muted px-1 py-0.5 rounded">{command.pnpm}</code></TableCell>
                      <TableCell>
                        {command.bun === "None" ? (
                          <Badge variant="outline" className="border-destructive">None</Badge>
                        ) : (
                          <code className="bg-muted px-1 py-0.5 rounded">{command.bun}</code>
                        )}
                      </TableCell>
                      <TableCell>{command.note}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
