import { definedSchemas } from '@/schemas'
import {NextApiRequest, NextApiResponse} from 'next'


export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const {name} = req.query

    if (typeof name !== 'string') {
        return res.status(400).json({error: 'Invalid schema name'})
    }

    if (name in definedSchemas === false) {
        return res.status(404).json({error: `Schema "${name}" not found`})
    }

    const schema = definedSchemas[name as keyof typeof definedSchemas]

    return res.status(200).json(schema);
}
