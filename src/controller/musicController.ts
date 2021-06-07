import { Request, Response } from 'express';
import { AddMusicDTO } from '../dto/request/addMusic.dto';
import { ModifyMusicDTO } from '../dto/request/modifyMusic.dto';
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
        this.addAsyncEndpoint('PUT', '/music/modify/:id', this.modifyMusic);
        this.addAsyncEndpoint(
            'PUT',
            '/music/modify/file/:id',
            this.modifyMusicFile,
            upload.single('file')
        );
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

    public modifyMusic = async (req: Request, res: Response) => {
        const { id } = req.params;
        const body: ModifyMusicDTO = req.body;

        await this.musicService.modifyMusic(parseInt(id), body);

        res.status(204).send();
    };

    public modifyMusicFile = async (req: Request, res: Response) => {
        const { id } = req.params;
        const file = req.file;

        await this.musicService.modifyMusicFile(parseInt(id), file);

        res.status(204).send();
    };
}
