import { Request, Response } from 'express';

import { ITool, IToolParams } from '../types/tool.types.js';
import { Tool } from '../models/tool.model.js';

export async function getScriptLatest(req: Request<IToolParams, any, any, any>, res: Response) {
  const { action, name } = req.params;
  if (!action || !name) {
    return res.status(400).json({ message: 'action and name Are required!' });
  }

  try {
    const existing: ITool | null = await Tool.findOne({ name, isLatest: true });
    if (!existing) {
      return res.status(404).json({ message: `${name} Not found!` });
    }

    if (!existing.assetUrls.get(action)) {
      return res
        .status(400)
        .json({ message: `${action} Not available for ${name} ${existing.version}` });
    }

    const owner: string = process.env.GITHUB_OWNER!;
    const repo: string = process.env.GITHUB_REPO!;

    const scriptUrl = `https://raw.githubusercontent.com/${owner}/${repo}/refs/heads/main/resources/scripts/${action}/${name}/${existing.version}.ps1`;

    res.redirect(302, scriptUrl);
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : 'Error in powershell.controller getScriptLatest!',
    });
  }
}

export async function getScript(req: Request<IToolParams, any, any, any>, res: Response) {
  const { action, name, version } = req.params;
  if (!action || !name || !version) {
    return res.status(400).json({ message: 'action, name and version Are required!' });
  }

  try {
    const existing: ITool | null = await Tool.findOne({ name, version });
    if (!existing) {
      return res.status(404).json({ message: `${name} ${version} Not found!` });
    }

    if (!existing.assetUrls.get(action)) {
      return res.status(400).json({ message: `${action} Not available for ${name} ${version}` });
    }

    const owner: string = process.env.GITHUB_OWNER!;
    const repo: string = process.env.GITHUB_REPO!;

    const scriptUrl = `https://raw.githubusercontent.com/${owner}/${repo}/refs/heads/main/resources/scripts/${action}/${name}/${version}.ps1`;

    res.redirect(302, scriptUrl);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Error in powershell.controller getScript!',
    });
  }
}
