import { Request, Response } from 'express';

import { Tool } from '../models/tool.model.js';
import { ITool, IToolBody, IToolParams } from '../types/tool.types.js';

export async function createTool(req: Request<any, any, IToolBody, any>, res: Response) {
  const { name, version, releaseDate, assetUrls } = req.body;
  let { isLatest } = req.body;
  if (!name || !version || !releaseDate || !assetUrls) {
    return res
      .status(400)
      .json({ message: 'name, version, releaseDate and assetUrls Are required!' });
  }

  try {
    const existing: ITool | null = await Tool.findOne({ name, version });
    if (existing) {
      return res.status(400).json({ message: `${name} ${version} Already exist!` });
    }

    if (isLatest === true) {
      await Tool.updateMany(
        { name },
        {
          $set: {
            isLatest: false,
          },
        },
      );
    }

    const findLatest: ITool | null = await Tool.findOne({ name, isLatest: true });
    if (!findLatest) {
      isLatest = true;
    }

    await Tool.create({
      name,
      version,
      releaseDate,
      isLatest,
      assetUrls,
    });

    res.status(201).json({ message: `${name} ${version} Created successfuly!` });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Error in tool.controller createTool!',
    });
  }
}

export async function updateTool(req: Request<any, any, IToolBody, any>, res: Response) {
  const { name, version, releaseDate, assetUrls } = req.body;
  let { isLatest } = req.body;
  if (!name || !version) {
    return res.status(400).json({ message: 'name and version Are required!' });
  }

  try {
    const existing: ITool | null = await Tool.findOne({ name, version });
    if (!existing) {
      return res.status(404).json({ message: `${name} ${version} Not found!` });
    }

    const isBasicSame =
      existing.name === name && existing.version === version && existing.isLatest === isLatest;

    const existingTime = existing.releaseDate.getTime();
    const payloadTime = new Date(releaseDate).getTime();
    const isDateSame = existingTime === payloadTime;

    const existingAssetsObj = Object.fromEntries(existing.assetUrls);
    const isAssetsSame = JSON.stringify(existingAssetsObj) === JSON.stringify(assetUrls);

    if (isBasicSame && isDateSame && isAssetsSame) {
      return res.status(400).json({ message: 'A different value is required for the update!' });
    }

    if (isLatest === true) {
      await Tool.updateMany(
        { name },
        {
          $set: {
            isLatest: false,
          },
        },
      );
    }

    const findLatest: ITool | null = await Tool.findOne({ name, isLatest: true });
    if (!findLatest) {
      isLatest = true;
    }

    await Tool.findOneAndUpdate(
      { name, version },
      {
        $set: {
          name,
          version,
          releaseDate,
          isLatest,
          assetUrls,
        },
      },
    );

    res.status(200).json({ message: `${name} ${version} Updated successfuly!` });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Error in tool.controller updateTool!',
    });
  }
}

export async function deleteTool(req: Request<IToolParams, any, any, any>, res: Response) {
  const { name, version } = req.params;
  if (!name || !version) {
    return res.status(400).json({ message: 'name and version Are required!' });
  }

  try {
    const deletedTool: ITool | null = await Tool.findOneAndDelete({ name, version });
    if (!deletedTool) {
      return res.status(404).json({ message: `${name} ${version} Not found!` });
    }
    res.status(200).json({ message: `${name} ${version} Deleted successfuly!` });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Error in tool.controller deleteTool!',
    });
  }
}

export async function getTool(req: Request<IToolParams, any, any, any>, res: Response) {
  const { name, version } = req.params;
  if (!name || !version) {
    return res.status(400).json({ message: 'name and version Are required!' });
  }

  try {
    const existing: ITool | null = await Tool.findOne({ name, version });
    if (!existing) {
      return res.status(404).json({ message: `${name} ${version} Not found!` });
    }

    res.status(200).json(existing);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Error in tool.controller getTool!',
    });
  }
}

export async function getAllTool(req: Request<any, any, any, any>, res: Response) {
  try {
    const allTool = await Tool.find().sort({ releaseDate: -1 });
    res.status(200).json(allTool);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Error in tool.controller getAllTool!',
    });
  }
}

export async function getAsset(req: Request<IToolParams, any, any, any>, res: Response) {
  const { action, name, version } = req.params;
  if (!action || !name || !version) {
    return res.status(400).json({ message: 'action, name and version Are required!' });
  }

  try {
    const existing: ITool | null = await Tool.findOne({ name, version });
    if (!existing) {
      return res.status(404).json({ message: `${name} ${version} Not found!` });
    }

    const assetUrl: string = existing.assetUrls.get(action) as string;
    if (!assetUrl) {
      return res.status(400).json({ message: `${action} Not available for ${name} ${version}!` });
    }

    res.redirect(302, assetUrl);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Error in tool.controller getAsset!',
    });
  }
}
