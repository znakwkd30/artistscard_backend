import { Request, Response } from 'express';
import { AddMusicDTO } from '../dto/request/addMusic.dto';
import { upload } from '../lib/upload';
import { MusicService, MusicServiceImpl } from '../service/musicService';
import { BaseController } from './baseController';

export class MusicController extends BaseController {
    private readonly musicService: MusicService;

    constructor() {
        super();
        this.musicService = new MusicServiceImpl();
    }

    public initializeEndpoints() {
        this.addAsyncEndpoint('POST', '/music', this.addMusic, upload.single('file'));
        this.addAsyncEndpoint('GET', '/music/search/:title', this.searchMusic);
    }

    public addMusic = async (req: Request, res: Response) => {
        const body: AddMusicDTO = req.body;
        const file: Express.Multer.File = req.file;

        const music = await this.musicService.addMusic(body, file);

        res.status(201).json(music);
    };

    public searchMusic = async (req: Request, res: Response) => {
        const { title } = req.params;

        const musics = await this.musicService.searchMusic(title);

        res.json(musics);
    };
}
