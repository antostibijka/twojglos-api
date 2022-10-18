import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { CreateProjectDto } from './dtos/create-project.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { Request, Response } from 'express';

@Controller('/api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.appService.createUser(createUserDto);
  }

  @Post('/login')
  async userLogin(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const data = await this.appService.userLogin(loginUserDto);
    response.cookie('userData', JSON.stringify(data));
    return data;
  }

  @Post('/delete-user/:userId')
  deleteUser(@Param('userId') userId: number) {
    return this.appService.deleteUser(userId);
  }

  @Post('/create-project')
  async createProject(
    @Body() createProjectDto: CreateProjectDto,
    @Req() request: Request,
  ) {
    const cookieData = await request.cookies['userData'];
    console.log(request.cookies['userData']);
    createProjectDto.isApproved = false;
    createProjectDto.city = cookieData.city.toLowerCase();
    createProjectDto.votes = 0;
    createProjectDto.author = cookieData?.name + ' ' + cookieData?.surname;
    return this.appService.createProject(createProjectDto);
  }

  @Post('/delete-project/:projectId')
  deleteProject(@Param('projectId') projectId: number) {
    return this.appService.deleteProject(projectId);
  }

  @Post('/approve-project/:projectId')
  approveProject(@Param('projectId') projectId: number) {
    return this.appService.approveProject(projectId);
  }

  @Post('/fetch-project/:projectId')
  fetchProject(
    @Param('projectId') projectId: number,
    @Body('userId') userId: number,
  ) {
    return this.appService.fetchProject(projectId, userId);
  }

  @Get('/fetch-projects/:city')
  fetchProjects(@Param('city') city: string) {
    city = city.toLowerCase();
    return this.appService.fetchProjects(city);
  }

  @Post('/vote/:projectId')
  projectVote(
    @Param('projectId') projectId: number,
    @Body('userId') userId: number,
  ) {
    return this.appService.projectVote(projectId, userId);
  }

  @Get('/settings/:userId')
  getSettings(@Param('userId') userId: number) {
    return this.appService.getSettings(userId);
  }

  @Post('/settings/:userId')
  saveSettings(@Param('userId') userId: number, @Body('theme') theme: string) {
    return this.appService.saveSettings(userId, theme);
  }
}
